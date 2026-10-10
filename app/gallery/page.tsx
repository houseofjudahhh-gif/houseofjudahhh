import Link from 'next/link';
import {database} from '../../db/adapter';
import Logo from '../components/Logo';
import type {Event} from '../lib/types';
export const dynamic='force-dynamic';
const PAGE_SIZE=12;
const formatDate=(s:string)=>new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(s));
export default async function GalleryArchive({searchParams}:{searchParams:Promise<{page?:string;q?:string;year?:string}>}){
 const params=await searchParams;
 const page=Math.min(100000,Math.max(1,Number.parseInt(params.page||'1',10)||1));
 const q=(params.q||'').trim().slice(0,100);
 const year=/^20\d{2}$/.test(params.year||'')?params.year||'':'';
 const where=`e.deleted=0 AND e.published=1 AND e.end_at < ? AND EXISTS(SELECT 1 FROM photos p WHERE p.event_id=e.id AND p.deleted=0 AND p.kind='photo') AND e.title LIKE ? ${year?"AND SUBSTR(e.start_at,1,4)=?":''}`;
 const args=[new Date().toISOString(),`%${q}%`,...(year?[year]:[])];
 let albums:Event[]=[],total=0,error=false;
 try{
  const count=await database().prepare(`SELECT COUNT(*) AS total FROM events e WHERE ${where}`).bind(...args).first<{total:number}>();total=count?.total||0;
  albums=(await database().prepare(`SELECT e.*, (SELECT COUNT(*) FROM photos p WHERE p.event_id=e.id AND p.deleted=0 AND p.kind='photo') AS photo_count, COALESCE((SELECT id FROM photos p WHERE p.id=e.poster_id AND p.deleted=0),(SELECT id FROM photos p WHERE p.event_id=e.id AND p.deleted=0 AND p.kind='photo' ORDER BY created_at LIMIT 1)) AS cover_id FROM events e WHERE ${where} ORDER BY e.start_at DESC LIMIT ? OFFSET ?`).bind(...args,PAGE_SIZE,(page-1)*PAGE_SIZE).all<Event>()).results;
 }catch(e){console.error('Gallery archive unavailable',e);error=true;}
 const pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
 const link=(n:number)=>`/gallery?${new URLSearchParams({...q?{q}:{},...year?{year}:{},page:String(n)}).toString()}`;
 return <><header className="site-header"><div className="header-inner"><Link href="/" aria-label="House of Judah home"><Logo/></Link><Link className="album-back" href="/#gallery">← Home</Link></div></header><main className="section album-page archive-page"><p className="eyebrow">House of Judah · Memories</p><h1>All Events</h1><p className="album-description">Browse our past gatherings. Select an event to see its details and photo album.</p><form className="archive-search" action="/gallery"><label>Search events<input type="search" name="q" defaultValue={q} placeholder="Search by event name" maxLength={100}/></label><label>Year<select name="year" defaultValue={year}><option value="">All years</option>{Array.from({length:25},(_,i)=>new Date().getFullYear()-i).map(y=><option key={y} value={y}>{y}</option>)}</select></label><button className="button" type="submit">Find events</button></form>{error?<p className="notice" role="alert">Could not load albums. Please try again.</p>:albums.length?<><p className="small-text">{total} event{total===1?'':'s'} · Page {page} of {pages}</p><div className="album-folder-grid">{albums.map(e=><Link className="album-folder" key={e.id} href={`/gallery/${encodeURIComponent(e.id)}`}><div className="album-folder-cover">{e.cover_id?<img src={`/api/media/${e.cover_id}`} alt={`${e.title} cover`} loading="lazy"/>:<span>Event album</span>}<span className="album-folder-count">{e.photo_count||0} photos</span></div><div className="album-folder-info"><h3>{e.title}</h3><p>{formatDate(e.start_at)}</p><p>{e.venue}</p><span className="album-open">View event album →</span></div></Link>)}</div><nav className="archive-pagination" aria-label="Gallery pages">{page>1&&<Link className="button button-outline" href={link(page-1)}>← Previous</Link>}{page<pages&&<Link className="button button-outline" href={link(page+1)}>Next →</Link>}</nav></>:<div className="quiet-state">No published event albums match your search.</div>}</main></>;
}
