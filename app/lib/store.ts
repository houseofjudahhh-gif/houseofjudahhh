import { database } from '../../db/adapter';
import { blobStorage } from './blob-storage';
const env = process.env;
import {getAdminUser,sameOrigin,type AdminUser} from './admin-auth';
export {sameOrigin} from './admin-auth';
import type { Event, Photo, Release } from './types';
export function db() { return database(); }
export function bucket() { return blobStorage(); }
export function isAdmin(user:AdminUser|null){const email=env.ADMIN_EMAIL?.trim().toLowerCase();return !!email&&!!user&&user.email===email;}
export async function admin(r?:Request){if(!isAdmin(await getAdminUser(r)))return Response.json({error:'Please sign in with the band administrator account.'},{status:403});if(r&&r.method!=='GET'&&!sameOrigin(r))return Response.json({error:'This request must come from your website.'},{status:403});return null;}
export const noStore={'Cache-Control':'no-store'};
export function fail(e:unknown){console.error('HOJ storage operation failed',e);return Response.json({error:'We could not save or load this right now. Please try again. Your input has been kept on screen.'},{status:503,headers:noStore});}
export function textValue(v:unknown,max:number){return typeof v==='string'?v.trim().slice(0,max):'';}
export function eventValues(v:Record<string,unknown>){const registrationUrl=textValue(v.registrationUrl,2000);if(registrationUrl){try{if(new URL(registrationUrl).protocol!=='https:')throw new Error();}catch{throw new Error('Use a full https:// registration link.');}}const title=textValue(v.title,160),venue=textValue(v.venue,240),description=textValue(v.description,3000),start=new Date(String(v.startAt)),end=new Date(String(v.endAt));if(!title||!venue||!Number.isFinite(+start)||!Number.isFinite(+end)||end<start)throw new Error('Enter an event name, venue, and valid start and end times.');return {title,venue,description,registrationUrl,startAt:start.toISOString(),endAt:end.toISOString(),published:v.published===true?1:0};}
export async function getEvents(all=false){return (await db().prepare(`SELECT e.*,(SELECT COUNT(*) FROM photos p WHERE p.event_id=e.id AND p.deleted=0) AS photo_count,COALESCE((SELECT id FROM photos p WHERE p.id=e.poster_id AND p.deleted=0),(SELECT id FROM photos p WHERE p.event_id=e.id AND p.deleted=0 ORDER BY created_at LIMIT 1)) AS cover_id FROM events e WHERE e.deleted=0 ${all?'':'AND e.published=1'} ORDER BY e.start_at DESC LIMIT 200`).all<Event>()).results;}
export async function getPhotos(all=false){return (await db().prepare(`SELECT p.id,p.event_id,p.caption,p.created_at,e.title AS event_title FROM photos p JOIN events e ON p.event_id=e.id WHERE p.deleted=0 AND p.kind='photo' AND e.deleted=0 ${all?'':'AND e.published=1'} ORDER BY p.created_at DESC LIMIT 1000`).all<Photo>()).results;}
export async function getReleases(){return (await db().prepare('SELECT id,title,subtitle,url,CASE WHEN thumbnail_key IS NOT NULL THEN 1 ELSE 0 END AS has_thumbnail,SUBSTR(thumbnail_key,-36) AS thumbnail_version FROM releases ORDER BY created_at DESC LIMIT 40').all<Release>()).results;}
