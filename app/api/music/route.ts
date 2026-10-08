import {admin,bucket,db,fail,getReleases,noStore,textValue} from '../../lib/store';
import {recordingUrl,recordingPlatform} from '../../lib/recordings';
import {readImage} from '../../lib/images';
export async function GET(){try{return Response.json(await getReleases(),{headers:noStore});}catch(e){return fail(e);}}
export async function POST(r:Request){return saveRecording(r);}
export async function PATCH(r:Request){return saveRecording(r,true);}
async function saveRecording(r:Request,editing=false){
 const denied=await admin(r);if(denied)return denied;
 let newKey:string|null=null;
 try{
  if(Number(r.headers.get('content-length')||0)>11*1024*1024)return Response.json({error:'Choose a thumbnail smaller than 10 MB.'},{status:413});
  let b:Record<string,unknown>,image:FormDataEntryValue|null=null;
  try{if(r.headers.get('content-type')?.includes('multipart/form-data')){const form=await r.formData();b=Object.fromEntries(form);image=form.get('thumbnail');}else{b=await r.json() as Record<string,unknown>;}if(!b||typeof b!=='object')throw new Error();}catch{return Response.json({error:'Check the recording details.'},{status:400});}
  const title=textValue(b.title,150),subtitle=textValue(b.subtitle,100),url=recordingUrl(b.url),id=editing?textValue(b.id,80):crypto.randomUUID();
  if(!title||!url)return Response.json({error:'Enter a title and a full YouTube video, Shorts, or Instagram post/reel link.'},{status:400});
  const previous=editing?await db().prepare('SELECT id,thumbnail_key,thumbnail_mime FROM releases WHERE id=?').bind(id).first<{id:string;thumbnail_key:string|null;thumbnail_mime:string|null}>():null;
  if(editing&&!previous)return Response.json({error:'This recording was not found.'},{status:404});
  let key=previous?.thumbnail_key||null,mime=previous?.thumbnail_mime||null;
  if(image instanceof File&&image.size){let result;try{result=await readImage(image);}catch(e){return Response.json({error:e instanceof Error?e.message:'Invalid thumbnail.'},{status:400});}newKey=`recording-thumbnails/${crypto.randomUUID()}`;await bucket().put(newKey,result.bytes,{httpMetadata:{contentType:result.mime}});key=newKey;mime=result.mime;}
  if(recordingPlatform(url)==='Instagram'&&!key)return Response.json({error:'Upload a thumbnail for this Instagram recording.'},{status:400});
  if(editing)await db().prepare('UPDATE releases SET title=?,subtitle=?,url=?,thumbnail_key=?,thumbnail_mime=? WHERE id=?').bind(title,subtitle,url,key,mime,id).run();
  else await db().prepare('INSERT INTO releases (id,title,subtitle,url,thumbnail_key,thumbnail_mime,created_at) VALUES (?,?,?,?,?,?,?)').bind(id,title,subtitle,url,key,mime,new Date().toISOString()).run();
  if(newKey&&previous?.thumbnail_key){try{await bucket().delete(previous.thumbnail_key);}catch(e){console.error('Could not clean up replaced recording thumbnail',e);}}
  return Response.json({id},{status:editing?200:201,headers:noStore});
 }catch(e){if(newKey){try{await bucket().delete(newKey);}catch{}}return fail(e);}
}
export async function DELETE(r:Request){const denied=await admin(r);if(denied)return denied;try{const b=await r.json() as {id?:unknown},id=textValue(b?.id,80),row=await db().prepare('SELECT thumbnail_key FROM releases WHERE id=?').bind(id).first<{thumbnail_key:string|null}>();if(!row)return Response.json({error:'Recording not found.'},{status:404});await db().prepare('DELETE FROM releases WHERE id=?').bind(id).run();if(row.thumbnail_key){try{await bucket().delete(row.thumbnail_key);}catch(e){console.error('Could not clean up recording thumbnail',e);}}return Response.json({ok:true},{headers:noStore});}catch(e){return fail(e);}}
