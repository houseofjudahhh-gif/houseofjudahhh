import {db,fail,noStore} from '../../../lib/store';
import type {Event,Photo} from '../../../lib/types';
export async function GET(_r:Request,{params}:{params:Promise<{id:string}>}){
 try{const {id}=await params;const event=await db().prepare('SELECT * FROM events WHERE id=? AND published=1 AND deleted=0 AND end_at<?').bind(id,new Date().toISOString()).first<Event>();
 if(!event)return Response.json({error:'Album not found.'},{status:404,headers:noStore});
 const photos=(await db().prepare("SELECT id,event_id,caption,created_at FROM photos WHERE event_id=? AND deleted=0 AND kind='photo' ORDER BY created_at ASC LIMIT 200").bind(id).all<Photo>()).results;
 return Response.json({event,photos},{headers:noStore});}catch(e){return fail(e);}
}
