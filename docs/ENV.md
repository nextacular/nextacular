# Environment Variables

Nextacular reads its configuration from `.env` (loaded by Next.js automatically). Copy [`.env.sample`](../.env.sample) to `.env` and fill in the values below.

A variable is **Required** if the app refuses to boot without it, **Conditional** if a feature needs it but the rest of the app keeps working without it, and **Optional** if it only affects analytics or non-essential behavior.

## Quick reference

| Variable                          | Required?   | Where it's used                          |
| --------------------------------- | ----------- | ---------------------------------------- |
| `APP_URL`                         | Required    | Middleware, sitemap, email links         |
| `NEXTAUTH_SECRET`                 | Required    | NextAuth session signing                 |
| `DATABASE_URL`                    | Required    | Prisma client + Prisma Migrate           |
| `SHADOW_DATABASE_URL`             | Conditional | Prisma Migrate on hosted Postgres        |
| `EMAIL_FROM`                      | Conditional | Magic-link sign-in, invite/notify emails |
| `EMAIL_SERVER_USER`               | Conditional | SMTP auth (nodemailer)                   |
| `EMAIL_SERVER_PASSWORD`           | Conditional | SMTP auth (nodemailer)                   |
| `EMAIL_SERVER_HOST`               | Conditional | SMTP host — overrides `EMAIL_SERVICE`    |
| `EMAIL_SERVER_PORT`               | Conditional | SMTP port (defaults to nodemailer's)     |
| `EMAIL_SERVER_SECURE`             | Optional    | Force implicit TLS on/off                |
| `EMAIL_SERVICE`                   | Conditional | Nodemailer well-known SMTP service       |
| `NEXT_PUBLIC_PUBLISHABLE_KEY`     | Conditional | Stripe.js on the billing page (client)   |
| `PAYMENTS_SECRET_KEY`             | Conditional | Stripe SDK (server)                      |
| `PAYMENTS_SIGNING_SECRET`         | Conditional | Stripe webhook signature verification    |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Optional    | GA4 page-views in production builds      |
| `NEXT_PUBLIC_VERCEL_IP_ADDRESS`   | Conditional | A-record hint shown on the Domain card   |
| `VERCEL_API_URL`                  | Conditional | Custom-domain API calls                  |
| `VERCEL_PROJECT_ID`               | Conditional | Custom-domain API calls                  |
| `VERCEL_TEAM_ID`                  | Conditional | Custom-domain API calls (team projects)  |
| `VERCEL_AUTH_BEARER_TOKEN`        | Conditional | Custom-domain API calls                  |
| `ADMIN_EMAIL`                     | Optional    | Seed script — initial admin user         |

## Minimum local-dev set

The smallest working `.env` for local development is:

```sh
APP_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgresql://nextacular:nextacular@localhost:5432/nextacular
EMAIL_FROM="Nextacular <hello@nextacular.test>"
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
ADMIN_EMAIL=admin@nextacular.test
```

Pair this with `npm run db:up` and magic-link sign-in works against [Mailpit](http://localhost:8025) without touching a real SMTP server.

## Required

### `APP_URL`

The public URL of the app. Used by the middleware to detect the workspace subdomain, by the sitemap handler to build absolute URLs, and embedded in magic-link / invitation emails. In local dev: `http://localhost:3000`.

### `NEXTAUTH_SECRET`

Secret used by NextAuth to sign session JWTs. Generate one with:

```sh
openssl rand -base64 32
```

Use a **different** value in production. Rotating this in production will sign every active user out.

### `DATABASE_URL`

Standard PostgreSQL connection string. Examples:

- Local docker-compose default: `postgresql://nextacular:nextacular@localhost:5432/nextacular`
- Supabase: copy from the project Settings → Database page (use the "Connection string" / Direct connection)
- Neon: copy from the project Dashboard → Connection Details
- Heroku: from the Heroku Postgres add-on credentials view

## Conditional

### `SHADOW_DATABASE_URL`

Prisma Migrate creates a temporary "shadow" database to detect unsafe schema changes. Most managed databases don't allow the database owner to `CREATE DATABASE`, so you need to point this at a separate, empty Postgres URL. Not required when running locally against a permissive Postgres.

### Email (`EMAIL_FROM`, `EMAIL_SERVER_*`, `EMAIL_SERVICE`)

Required to deliver magic-link sign-in emails (NextAuth's `EmailProvider`) and workspace invitations.

- `EMAIL_FROM`: the sender address. Format: `Name <email@domain>` or plain `email@domain`.
- `EMAIL_SERVER_USER` / `EMAIL_SERVER_PASSWORD`: SMTP credentials.

Point the transport at a server in one of two ways:

- `EMAIL_SERVER_HOST` / `EMAIL_SERVER_PORT` — a raw SMTP host. Works with every provider, and is the only option for a provider that nodemailer does not ship a shorthand for.
- `EMAIL_SERVICE` — matches a [nodemailer well-known service](https://nodemailer.com/smtp/well-known/) (e.g. `gmail`, `outlook`, `mailgun`). Only these names resolve; anything else fails to connect.

`EMAIL_SERVER_HOST` takes precedence when both are set.

`EMAIL_SERVER_SECURE` forces implicit TLS on (`true`) or off (`false`). Leave it unset unless you have a reason: it defaults to `true` on port 465 and `false` everywhere else, which is correct for 587, 25, and Mailpit's 1025 (all of which upgrade via STARTTLS).

For local development the `docker compose` stack runs [Mailpit](https://mailpit.axllent.org/) on port 1025. All outgoing mail is captured at <http://localhost:8025> and no credentials are required — leave `EMAIL_SERVER_USER` / `EMAIL_SERVER_PASSWORD` empty. Mailpit accepts any SMTP auth.

For production, use any transactional provider that exposes SMTP credentials:

| Provider | Host                                | Port |
| -------- | ----------------------------------- | ---- |
| Resend   | `smtp.resend.com`                   | 587  |
| SendGrid | `smtp.sendgrid.net`                 | 587  |
| Postmark | `smtp.postmarkapp.com`              | 587  |
| AWS SES  | `email-smtp.<region>.amazonaws.com` | 587  |
| MailKite | `smtp.mailkite.dev`                 | 587  |

### Stripe billing (`NEXT_PUBLIC_PUBLISHABLE_KEY`, `PAYMENTS_SECRET_KEY`, `PAYMENTS_SIGNING_SECRET`)

Required only when the billing/upgrade UI and webhook handler are in use. Source these from <https://dashboard.stripe.com/apikeys> (publishable + secret) and <https://dashboard.stripe.com/webhooks> (signing secret).

Use Stripe test keys (`pk_test_*` / `sk_test_*` / `whsec_*`) for development. To test webhooks locally run:

```sh
stripe listen --forward-to localhost:3000/api/payments/hooks
```

and copy the printed `whsec_*` value into `PAYMENTS_SIGNING_SECRET`.

If billing isn't part of your fork, leave all three commented out — the rest of the app will function and only `/account/billing` will throw on load.

### Vercel custom domains (`NEXT_PUBLIC_VERCEL_IP_ADDRESS`, `VERCEL_API_URL`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`, `VERCEL_AUTH_BEARER_TOKEN`)

The workspace "Domains" settings page uses Vercel's Domains API to add, verify and remove custom domains attached to your deployment.

- `NEXT_PUBLIC_VERCEL_IP_ADDRESS`: the IPv4 address shown to users in the Apex Record table. Use Vercel's default `76.76.21.21`.
- `VERCEL_API_URL`: `https://api.vercel.com`.
- `VERCEL_PROJECT_ID`: from <https://vercel.com/_team_/_project_/settings>.
- `VERCEL_TEAM_ID`: only needed when the project belongs to a team. From <https://vercel.com/teams/_team_/settings>.
- `VERCEL_AUTH_BEARER_TOKEN`: a personal token from <https://vercel.com/account/tokens>. Scope it to the team / project where possible.

## Optional

### `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`

GA4 measurement ID (`G-XXXXXXXXXX`). Only initialised when `NODE_ENV === 'production'`, so it has no effect in `npm run dev`.

### `ADMIN_EMAIL`

Email of the user created by `npm run seed`. Defaults to `admin@nextacular.test` if not set. Sign in with this email after seeding to see the demo workspace.

## Notes

- All `NEXT_PUBLIC_*` variables are bundled into the client-side JavaScript. Never put a server secret behind that prefix.
- Changes to `.env` require restarting `next dev` to take effect.
- For Vercel deployments, configure these in **Project Settings → Environment Variables** rather than committing them.
