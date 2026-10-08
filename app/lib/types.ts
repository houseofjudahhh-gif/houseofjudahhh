export type Event = { id:string; title:string; start_at:string; end_at:string; venue:string; description:string; published:number; created_at:string; registration_url:string; poster_id:string|null; deleted:number; photo_count?:number; cover_id?:string|null };
export type Photo = { id:string; event_id:string; caption:string; created_at:string; event_title?:string };
export type Release = { id:string; title:string; subtitle:string; url:string; has_thumbnail:number; thumbnail_version:string|null };
export type Invitation = { id:string; name:string; email:string; organization:string; event_date:string; message:string; created_at:string };
