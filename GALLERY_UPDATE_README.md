# House of Judah — event album archive update

## What changed
- Homepage Moments Together shows up to six latest published **past events** as one folder per event (event name and date).
- **View all events** opens `/gallery`, with search, year filter, and 12 albums per page.
- Clicking a folder opens `/gallery/[id]`, showing event title, date, venue, description, and mixed-ratio photos.
- Past Event Albums admin retains create/edit/publish, optional cover, multi-photo upload, and captions.
- Upcoming Events retains optional poster.
- Homepage headings changed to **Upcoming Events** and **Latest Release**.
- Removed Sushanth Daggumati from the *leadership summary* (not the separate musician/team listing).

## Important deployment notes
- This archive uses the existing `events` and `photos` Turso tables. No database migration is required.
- Only published, completed events with at least one uploaded photo appear as albums.
- Uploads still use your existing Vercel Blob adapter. Live Blob uploads/downloads have NOT been verified by this package. Test in a preview before merging into main.
- The existing admin event listing remains limited to 200 events and each album to 100 photos; a future admin pagination upgrade may be needed for very large archives.
- Never commit `.env.local`, `.dev.vars`, credentials, or tokens.
- Work on `gallery-admin-update`; verify Vercel preview before merging into main.
