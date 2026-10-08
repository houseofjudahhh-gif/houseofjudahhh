# House of Judah website

Read **START_HERE.md** first to run the complete website and sign in locally.

Dark background, gold accents, white text, the exact original lion image, and one bundled wide, bold font across header/hero/footer branding. The centered hero lion stays above the title and blends into the background. There is no Listen now button or public admin link. Worship and media team members appear together, with names and roles only.

## Complete application

React + TypeScript (Vinext/Vite), CSS, Cloudflare D1 SQLite records, R2 image storage, and an independent owner email/password login. It runs locally with emulated database/image storage and does not require ChatGPT sign-in. The ZIP contains all source, original logo, included display font/license, database migrations, build/start/setup scripts, pinned dependency lockfile, private local configuration and a portable design preview. Installed dependencies and generated build output are intentionally excluded and recreated with the supplied commands.

Use Node.js 22.13+ and pnpm 11.25.0:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm setup
pnpm start
```

The working local website runs at `http://127.0.0.1:5173`; admin entry is `/admin/login`. Use a new extracted folder for the first setup. `pnpm setup` copies the bundled private local configuration into ignored .dev.vars and applies all generated SQL migrations. Subsequent setup calls apply only new migrations and leave existing records intact. `pnpm start` loads the private runtime bindings beside the generated Worker config. For frontend/framework development, `pnpm dev` is also available after database setup; the production-mode start command above is the verified local flow.

`pnpm admin:credentials` privately updates the single owner account's email/password. It generates a salted hash and a fresh random session secret. There are no other users and no signup endpoint. Sessions last eight hours, are checked on the server for every protected read/write, and are revoked by sign-out. See ADMIN_ACCESS.md for details.

## Content management

Create/edit/save draft/publish/unpublish/delete/restore events; edit date, start/end time, location, description and HTTPS registration links. Save an event before uploading its poster and gallery photos. JPEG, PNG and WebP uploads are checked by size and file signature: up to 10 MB per image and 100 images per event. Posters are separate from additional gallery photos. Replacements, captions, removal and undo are available. Deleting an event hides it and its images; restoring it returns it to draft.

Upcoming events are selected automatically by end time. Past published event photos remain in the gallery. Public event dates/times use India Standard Time; the editor uses your device's timezone. Visitors get updated content on reload or when returning to the tab. Photos are stored in R2 in a hosted installation and in local emulated storage during local use, never only in browser storage or Google Drive.

Videos & links manages YouTube videos/Shorts/live links and Instagram posts/reels. Upload or replace a thumbnail directly from your device. Instagram requires your uploaded thumbnail; YouTube uses its video thumbnail when there is no uploaded one. Titles, details and links can be edited. Removing a recording removes its uploaded thumbnail. Invitations saves Book Us submissions in the private inbox; no automated notification emails are sent.

## Fonts and assets

HOUSE OF JUDAH branding uses included **Syncopate Bold** to approximate the second supplied screenshot's wide, bold lettering. The font is embedded locally for consistent appearance; its Apache 2.0 license is included under public/fonts. This is not a claim that the exact Horizon font file was supplied. Neue Machina remains the configured local typeface for other text; without a licensed font file, it falls back to Arial/Helvetica. The original lion PNG is used unmodified; only display size and opacity/blending are controlled by CSS.

preview.html embeds the stylesheet, display font and original logo for offline visual review. It is not the running full-stack application and cannot authenticate, store uploads or save invitations.

## Online hosting and portability

Nothing has been published. The project currently targets a Cloudflare-compatible full-stack Worker with D1 (binding DB) and R2 (binding BUCKET). The .openai/hosting.json project reservation is retained, but this login no longer depends on platform identity headers. No authentication gateway is needed for owner password verification.

Before online hosting, generate fresh credentials privately with `pnpm admin:credentials`, then set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET as **private runtime secrets**. Provision durable D1/R2, apply every drizzle migration in order, bind the resources, configure HTTPS, and deploy the Worker plus static assets. Local data is not automatically transferred to hosted D1/R2. The runtime must allow sufficient CPU time for password verification; measure authenticated login under the chosen hosting plan.

This is not a static Netlify drag-and-drop bundle. A Netlify deployment would require adapting the server runtime, database and storage; uploading only preview.html will not run the dashboard. A .com or .in domain is registered separately and connected when hosting is selected. Keep private-config, .dev.vars, .wrangler/state, and all credential values out of public static uploads.

## Validation

Use `pnpm exec tsc --noEmit` and `pnpm build`. VALIDATION.txt records the checks completed for this delivery. The packaged source is also extracted and built during verification. Local backend authentication/content tests do not replace a hosted HTTPS sign-in/upload check when deploying later.
