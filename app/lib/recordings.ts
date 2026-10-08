export function recordingUrl(value:unknown){
 if(typeof value!=='string')return null;
 try{const u=new URL(value);if(u.protocol!=='https:')return null;
 const h=u.hostname.toLowerCase();if(!['youtube.com','www.youtube.com','m.youtube.com','youtu.be','instagram.com','www.instagram.com'].includes(h))return null;
 if(h==='youtu.be'&&/^\/[A-Za-z0-9_-]{11}\/?$/.test(u.pathname))return u.toString();
 if(h.includes('youtube.com')&&((u.pathname==='/watch'&&/^[A-Za-z0-9_-]{11}$/.test(u.searchParams.get('v')||''))||/^\/(shorts|live|embed)\/[A-Za-z0-9_-]{11}\/?$/.test(u.pathname)))return u.toString();
 if(h.includes('instagram.com')&&/^\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?$/.test(u.pathname))return u.toString();
 }catch{}return null;
}
export function recordingPlatform(url:string){try{return new URL(url).hostname.includes('instagram.com')?'Instagram':'YouTube';}catch{return 'Recording';}}
export function youtubeThumbnail(url:string){try{const u=new URL(url);let id=u.hostname==='youtu.be'?u.pathname.split('/')[1]:u.pathname==='/watch'?u.searchParams.get('v'):u.pathname.split('/')[2];if(!u.hostname.includes('youtube.com')&&u.hostname!=='youtu.be')return null;if(!id||!/^[A-Za-z0-9_-]{11}$/.test(id))return null;return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;}catch{return null;}}
