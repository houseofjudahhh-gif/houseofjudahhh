import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const events = sqliteTable('events', {
  id:text('id').primaryKey(), title:text('title').notNull(), startAt:text('start_at').notNull(), endAt:text('end_at').notNull(),
  venue:text('venue').notNull(), registrationUrl:text('registration_url').notNull().default(''), posterId:text('poster_id'), deleted:integer('deleted').notNull().default(0), description:text('description').notNull().default(''), published:integer('published').notNull().default(0), createdAt:text('created_at').notNull(),
}, t => [index('idx_events_published_start').on(t.published,t.startAt)]);
export const photos = sqliteTable('photos', {
  id:text('id').primaryKey(), eventId:text('event_id').notNull().references(()=>events.id), storageKey:text('storage_key').notNull(),
  kind:text('kind').notNull().default('photo'), mime:text('mime').notNull(), size:integer('size').notNull(), caption:text('caption').notNull().default(''), deleted:integer('deleted').notNull().default(0), createdAt:text('created_at').notNull(),
}, t => [index('idx_photos_event_deleted').on(t.eventId,t.deleted)]);
export const invitations = sqliteTable('invitations', {
  id:text('id').primaryKey(), name:text('name').notNull(), email:text('email').notNull(), organization:text('organization').notNull(),
  eventDate:text('event_date').notNull(), message:text('message').notNull(), createdAt:text('created_at').notNull(), senderHash:text('sender_hash').notNull(),
}, t=>[index('idx_invitations_sender_created').on(t.senderHash,t.createdAt)]);
export const releases = sqliteTable('releases', {
  id:text('id').primaryKey(), title:text('title').notNull(), subtitle:text('subtitle').notNull(), url:text('url').notNull(), thumbnailKey:text('thumbnail_key'), thumbnailMime:text('thumbnail_mime'), createdAt:text('created_at').notNull(),
});

export const adminSessions=sqliteTable('admin_sessions',{tokenHash:text('token_hash').primaryKey(),email:text('email').notNull(),credentialVersion:text('credential_version').notNull(),createdAt:integer('created_at').notNull(),expiresAt:integer('expires_at').notNull()},t=>[index('idx_admin_sessions_expiry').on(t.expiresAt)]);
export const adminLoginLimits=sqliteTable('admin_login_limits',{bucket:text('bucket').primaryKey(),attempts:integer('attempts').notNull(),expiresAt:integer('expires_at').notNull()},t=>[index('idx_admin_login_limits_expiry').on(t.expiresAt)]);
