 'use client';
import {useState,useEffect} from 'react';
import {Play,Camera,Music2} from 'lucide-react';
import {recordingPlatform,youtubeThumbnail} from '../lib/recordings';
import type {Release} from '../lib/types';
export default function ReleaseCard({release:r}:{release:Release}){
 const [failed,setFailed]=useState(false);const platform=recordingPlatform(r.url),thumbnail=r.has_thumbnail?`/api/music/${r.id}/thumbnail?v=${r.thumbnail_version||r.id}`:youtubeThumbnail(r.url);
 useEffect(()=>setFailed(false),[thumbnail]);
 return <article className="music-card"><a className="recording-thumbnail" href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${r.title} on ${platform}`}>
 {thumbnail&&!failed?<img src={thumbnail} alt={`${r.title} thumbnail`} loading="lazy" onError={()=>setFailed(true)}/>:<div className="thumbnail-empty"><Music2 size={36}/><span>{platform==='Instagram'?'Worship on Instagram':'Worship recording'}</span></div>}
 <span className="platform-badge">{platform==='Instagram'?<Camera size={14}/>:<Play size={15}/>} {platform}</span><span className="play-overlay"><Play size={24}/></span></a>
 <h3>{r.title}</h3><p>{r.subtitle}</p><a className="button button-muted" href={r.url} target="_blank" rel="noopener noreferrer"><Play size={15}/>Watch on {platform}</a></article>;
}
