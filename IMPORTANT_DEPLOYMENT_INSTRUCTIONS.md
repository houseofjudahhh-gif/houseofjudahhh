# House of Judah — complete website update

## Requested changes
- Homepage: Moments Together shows up to six recent published past-event albums with event name and date.
- View all events links to /gallery, with search, year filtering, and pagination.
- /gallery/[id] shows the selected event and its photos.
- Admin: Upcoming Events and Past Event Albums are separate tabs; poster upload optional.
- Homepage headings: Upcoming Events and Latest Release.
- About > Our team: no Vice President Sushanth Daggumati entry. Sahan Raj P remains Vice President. The separate Worship & Media team listing is intentionally retained.

## Critical: Preview versus production
Pushing gallery-admin-update to GitHub only updates a Vercel PREVIEW deployment.
It does NOT update the production URL houseofjudahhh.vercel.app.
Test the branch preview deployment first. To publish, merge gallery-admin-update into main, then wait for the production deployment to finish.

## Installation
Copy project files into your existing project, preserving .env.local.
Run: npx --yes pnpm@11.25.0 build
Run: git add app IMPORTANT_DEPLOYMENT_INSTRUCTIONS.md
Run: git commit -m "Finish event album archive and homepage corrections"
Run: git push origin gallery-admin-update

## Verify after deploy
1. Visit the exact Vercel preview URL for branch gallery-admin-update.
2. Check homepage headings and the About team section.
3. Click View all events and check /gallery.
4. Create a past event in admin, add photos, publish it, and verify it appears as one album card.
5. Open the album and verify the photos and details.
6. After successful preview testing, merge branch into main to update the public production site.

## Notes
A successful build does not prove Vercel Blob uploads or Turso reads/writes work; test these live.
Do not commit .env.local or other secrets.
