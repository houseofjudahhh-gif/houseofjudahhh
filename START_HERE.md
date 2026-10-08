# Start your House of Judah website

Nothing has been published. This folder includes the full website, private administrator login, database migrations, image uploads, and a separate offline design preview.

## Run the working website on your Mac

1. Extract the ZIP into a **new folder**. Keep your earlier copy as a backup. Do not merge dependencies or database folders from the older version.
2. Install Node.js 22.13 or newer and pnpm 11.25.0 if they are not already installed. If Node is installed but pnpm is missing, run `npm install -g pnpm@11.25.0` in Terminal.
3. Open Terminal in the extracted **House_of_Judah_Website** folder. You can type `cd `, drag this folder from Finder into Terminal, and press Return.
4. Run these commands:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm setup
pnpm start
```

5. Keep Terminal running and open `http://127.0.0.1:5173` in your browser.
6. For admin, type `http://127.0.0.1:5173/admin/login` directly. The public website does not contain this link.
7. Enter **houseofjudahhh@gmail.com** and the password you supplied in this conversation. The supplied password is configured for this local copy. It is not printed in the website or these instructions, and its plaintext is not in the files.

`pnpm setup` initializes the local database and installs the private runtime configuration. It can be rerun in this new folder without deleting content. Restart the server after changing runtime credentials. If port 5173 is already being used by the earlier website, stop that Terminal process with Control+C first.

## Upload and edit content

- **Events:** create an event, save as draft or publish it, and change its date, time, venue, description or registration link.
- **Posters and event photos:** save the event first, then upload a poster and additional photos. Replace or remove images, edit captions, and display the published gallery. Team members have no photo fields.
- **Videos & links:** publish or edit YouTube/Instagram recordings, titles, details and thumbnails. YouTube can use its automatic thumbnail; Instagram requires an uploaded one.
- **Invitations:** read bookings sent through the website.
- **Sign out:** click Sign out in the dashboard. The session is revoked on the server.

**Publish event** makes a saved event visible in your running local website; it does not deploy the whole website to the internet. No online publishing is needed for local editing/testing. Complete the event name, venue, start and end fields first. Missing fields are highlighted; save errors remain visible at the top. An event only appears in **Upcoming Events** when its end time has not passed. Past events stay in the dashboard, and their published photos appear in the gallery. Open/refresh the running public website (not preview.html) to see saved changes. Draft events and their photos stay private. Local records and images remain in this folder's ignored `.wrangler/state` directory when you stop and restart the server. Back up that directory if you need to retain local content.

## Change your admin password privately

The supplied password was shared in chat. Change it before putting the website online:

```bash
pnpm admin:credentials
```

Enter the admin email and new password at the private Terminal prompts. The password entry is masked. This replaces the local password hash and session secret. Restart `pnpm start`; existing sessions will no longer grant access. Do not send the new password in chat.

## Design preview only

Open **preview.html** to see the website without installing anything. This preview has no working admin login, uploads, database or invitation saving. Use the steps above for the complete working website.

For online hosting requirements and technical details, read README.md and ADMIN_ACCESS.md.
