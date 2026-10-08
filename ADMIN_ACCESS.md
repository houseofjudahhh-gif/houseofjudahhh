# Private administrator access

## Local login

Address: `http://127.0.0.1:5173/admin/login`

Email: **houseofjudahhh@gmail.com**

Password: use the password you supplied in this conversation. The local private configuration has its salted hash, never the plaintext password. Follow START_HERE.md before signing in. No ChatGPT account or external authentication service is needed for this login.

There is exactly one configured owner account. There is no registration page, public admin link, or default secondary account. Typing the login address does not grant access. Every event, photo, poster, recording, thumbnail and inbox management API checks the server-side session.

## After hosting

Type `/admin/login` after your actual website address and use the configured admin email/password. Production must use HTTPS, a durable database, image storage and private runtime credentials. Nothing has been published or connected to a live domain in this delivery.

Keep **private-config/local-admin.env** and **.dev.vars** private. These contain the password hash and session secret. They are ignored by Git and must never be uploaded as public static files or pasted into frontend variables. The supplied local configuration is for local use; generate a new password and session secret before hosting.

## Sessions and access

Successful sign-in creates a random session token in an HttpOnly, SameSite=Strict cookie. Production cookies are Secure and host-only. Localhost uses a separate development cookie. The database stores a keyed hash of the token. Sessions expire after eight hours. Sign-out deletes the session; replaying the old cookie is rejected. Changing the admin email, password hash or session secret invalidates old sessions.

Passwords are verified on the server with salted PBKDF2-SHA256 (600,000 iterations). Login requests have persistent database rate limits and generic failure messages. Forged ChatGPT identity headers do not grant access. All write requests require a matching Origin.

## Recovery / password changes

Run `pnpm admin:credentials` in your own Terminal to create a new password privately. Restart the local server. For a hosted installation, update ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET as private runtime secrets and restart/redeploy using your hosting workflow. There is no public password-reset route; control of the hosting account is required for recovery.

Static About text, team names, booking phone/email and design are edited in the supplied source files. The dashboard edits events, galleries and YouTube/Instagram recording cards.
