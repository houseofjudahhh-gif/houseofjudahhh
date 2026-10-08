export async function readImage(file:FormDataEntryValue|null){
 if(!(file instanceof File)||!file.size||file.size>10*1024*1024)throw new Error('Choose a JPG, PNG, or WebP image up to 10 MB.');
 const bytes=new Uint8Array(await file.arrayBuffer());let mime='';
 if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)mime='image/jpeg';
 else if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10)mime='image/png';
 else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')mime='image/webp';
 if(!mime)throw new Error('This is not a supported image. Use JPG, PNG, or WebP.');
 return {bytes,mime};
}
