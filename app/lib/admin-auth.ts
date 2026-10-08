import { database } from '../../db/adapter';
const env = process.env;
import {headers} from 'next/headers';
import {createHmac,pbkdf2Sync,randomBytes,timingSafeEqual} from 'node:crypto';

export type AdminUser={email:string;displayName:string;sessionId:string};
const HOURS=8,LOCAL_COOKIE='hoj_admin_local',SECURE_COOKIE='__Host-hoj_admin';
export function authConfigured(){return !!env.ADMIN_EMAIL&&!!env.ADMIN_PASSWORD_HASH&&!!env.ADMIN_SESSION_SECRET&&env.ADMIN_SESSION_SECRET.length>=32;}
function adminDatabase(){return database();}
function email(){return env.ADMIN_EMAIL?.trim().toLowerCase()||'';}
function fingerprint(){return createHmac('sha256',env.ADMIN_SESSION_SECRET!).update(`${email()}\n${env.ADMIN_PASSWORD_HASH}`).digest('hex');}
function sessionKey(token:string){return createHmac('sha256',env.ADMIN_SESSION_SECRET!).update('session:'+token).digest('hex');}
export function localRequest(h:Headers){const host=(h.get('host')||'').toLowerCase().replace(/:\d+$/,'');return host==='localhost'||host==='127.0.0.1'||host==='[::1]'||host==='terminal.local';}
function cookieName(h:Headers){return localRequest(h)?LOCAL_COOKIE:SECURE_COOKIE;}
function readToken(h:Headers){const value=(h.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName(h)+'='))?.slice(cookieName(h).length+1);return value&&/^[A-Za-z0-9_-]{43}$/.test(value)?value:null;}
export function sameOrigin(r:Request){try{const origin=r.headers.get('origin');if(!origin)return false;const url=new URL(r.url);const expected=new URL(`${url.protocol}//${r.headers.get('host')||url.host}`);return new URL(origin).origin===expected.origin;}catch{return false;}}
export function transportAllowed(r:Request){return new URL(r.url).protocol==='https:'||localRequest(r.headers);}
export function sessionCookie(h:Headers,token:string,maxAge=HOURS*3600){return `${cookieName(h)}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${localRequest(h)?'':'; Secure'}`;}
export async function getAdminUser(r?:Request):Promise<AdminUser|null>{
 if(!authConfigured())return null;
 const h=r?.headers||new Headers(await headers()),token=readToken(h);if(!token)return null;
 const row=await adminDatabase().prepare('SELECT token_hash,email,credential_version,expires_at FROM admin_sessions WHERE token_hash=? AND expires_at>?').bind(sessionKey(token),Date.now()).first<{token_hash:string;email:string;credential_version:string;expires_at:number}>();
 if(!row||row.email!==email()||row.credential_version!==fingerprint())return null;
 return {email:row.email,displayName:'House of Judah',sessionId:row.token_hash};
}
export function verifyPassword(password:string){
 const parts=env.ADMIN_PASSWORD_HASH?.split('$')||[];
 if(parts.length!==4||parts[0]!=='pbkdf2-sha256'||parts[1]!=='600000'||!/^[a-f0-9]{32}$/.test(parts[2])||!/^[a-f0-9]{64}$/.test(parts[3]))throw new Error('Administrator credentials must be configured');
 const actual=pbkdf2Sync(password,Buffer.from(parts[2],'hex'),600000,32,'sha256');
 return timingSafeEqual(actual,Buffer.from(parts[3],'hex'));
}
export async function allowLogin(r:Request){
 const now=Date.now(),window=Math.floor(now/900000),ip=r.headers.get('cf-connecting-ip')||'local';
 const ipKey=createHmac('sha256',env.ADMIN_SESSION_SECRET!).update(`ip:${ip}:${window}`).digest('hex');
 const keys=[ipKey,createHmac('sha256',env.ADMIN_SESSION_SECRET!).update(`global:${window}`).digest('hex')];
 const results=await adminDatabase().batch<{attempts:number}>(keys.map(key=>adminDatabase().prepare('INSERT INTO admin_login_limits (bucket,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts').bind(key,(window+1)*900000)));
 return {allowed:Number(results[0].results[0]?.attempts||0)<=8&&Number(results[1].results[0]?.attempts||0)<=100,retryAfter:Math.max(1,Math.ceil(((window+1)*900000-now)/1000))};
}
export async function createSession(){
 const token=randomBytes(32).toString('base64url'),now=Date.now();
 await adminDatabase().batch([
  adminDatabase().prepare('DELETE FROM admin_sessions WHERE expires_at<=? OR credential_version<>?').bind(now,fingerprint()),
  adminDatabase().prepare('DELETE FROM admin_login_limits WHERE expires_at<=?').bind(now),
  adminDatabase().prepare('INSERT INTO admin_sessions (token_hash,email,credential_version,created_at,expires_at) VALUES (?,?,?,?,?)').bind(sessionKey(token),email(),fingerprint(),now,now+HOURS*3600000)
 ]);
 return token;
}
export async function revokeSession(r:Request){if(!authConfigured())return;const token=readToken(r.headers);if(token)await adminDatabase().prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(sessionKey(token)).run();}
