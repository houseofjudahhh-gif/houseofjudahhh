import Site from './components/Site';
import {getEvents,getPhotos,getReleases} from './lib/store';
export const dynamic='force-dynamic';
export default async function Home(){
  try { const [events,photos,releases]=await Promise.all([getEvents(),getPhotos(),getReleases()]);return <Site initial={{events,photos,releases}}/>; }
  catch(error){console.error('Public content unavailable',error);return <Site initial={{events:[],photos:[],releases:[]}} unavailable/>;}
}
