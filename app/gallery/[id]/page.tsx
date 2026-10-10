import GalleryAlbum from '../../components/GalleryAlbum';
export default async function GalleryPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <GalleryAlbum id={id}/>;}
