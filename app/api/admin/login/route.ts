import {env} from 'cloudflare:workers';
import {allowLogin,authConfigured,createSession,sameOrigin,sessionCookie,transportAllowed,verifyPassword} from '../../../lib/admin-auth';
const noStore={'Cache-Control':'no-store'};
export async function POST(r:Request){
 if(!sameOrigin(r)||!transportAllowed(r))return Response.json({error:'Please sign in through this website over a secure connection.'},{status:403,headers:noStore});
 if(!authConfigured())return Response.json({error:'Admin login needs setup. Follow START_HERE.md in the website files.'},{status:503,headers:noStore});
 if(!r.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'Use the administrator login form.'},{status:415,headers:noStore});
 try{
  const limit=await allowLogin(r);if(!limit.allowed)return Response.json({error:'Too many attempts. Please wait before trying again.'},{status:429,headers:{...noStore,'Retry-After':String(limit.retryAfter)}});
  if(Number(r.headers.get('content-length')||0)>4096)return Response.json({error:'Invalid login details.'},{status:400,headers:noStore});
  const raw=await r.text();if(raw.length>4096)return Response.json({error:'Invalid login details.'},{status:400,headers:noStore});
  let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'Invalid login details.'},{status:400,headers:noStore});}
  if(typeof body?.email!=='string'||typeof body?.password!=='string'||body.password.length>512)return Response.json({error:'Enter your email and password.'},{status:400,headers:noStore});
  const valid=verifyPassword(body.password);
  if(body.email.trim().toLowerCase()!==env.ADMIN_EMAIL!.trim().toLowerCase()||!valid)return Response.json({error:'Incorrect email or password.'},{status:401,headers:noStore});
  const token=await createSession();return Response.json({ok:true},{headers:{...noStore,'Set-Cookie':sessionCookie(r.headers,token)}});
 }catch(e){console.error('Administrator sign-in unavailable',e instanceof Error?e.message:'Storage error');return Response.json({error:'Sign-in is unavailable. Check the local setup or try again shortly.'},{status:503,headers:noStore});}
}
