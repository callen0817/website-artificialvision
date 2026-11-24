# Artificial Vision website

Public marketing and administration frontend for Artificial Vision, built with React, TypeScript, Vite and Tailwind CSS.

## Local development

Requirements: Node.js 20 or later and npm.

```sh
npm ci
npm run dev
```

Create a local `.env` with the public frontend configuration:

```sh
VITE_SUPABASE_URL=<your-backend-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-public-anon-key>
VITE_SUPABASE_PROJECT_ID=<your-backend-project-id>
```

These are browser-public settings. Never put signing secrets, service-role keys or other private credentials in `VITE_*` variables or in this repository.

## Production build

```sh
npm ci
npm run build
```

The deployable site is written to `dist`. The build uses only repository-local images, video and downloads; it does not require Lovable's asset host.

## Cloudflare Pages

- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 20 or later
- Add the three `VITE_SUPABASE_*` variables above to both Production and Preview environments.

`public/_redirects` is copied into the build and sends frontend routes to `index.html`, so direct visits and refreshes such as `/av-suite/av-hero`, `/av-scan` and `/admin` work on Cloudflare Pages.

The repository intentionally uses `package-lock.json` with packages from the public npm registry. Bun lockfiles are not required for deployment.

## Backend and custom domain

The frontend can be hosted independently, but the database, admin authentication and signed product-event receiver still require the configured backend. Keep that service available or migrate it separately before switching DNS.

The canonical public address is `https://artificialviz.com`. Add both `artificialviz.com` and `www.artificialviz.com` as custom domains only after the first Cloudflare deployment and admin sign-in have been verified.

## Cloudflare Workers static hosting

For the existing `website-artificialvision` Worker connected to GitHub, use
`npm run build` as the build command and `npx wrangler deploy` as the deploy
command. `wrangler.jsonc` serves `dist` with single-page application fallback.
The standard Vite React plugin avoids requiring SWC native bindings on the build host.

Set the three public `VITE_SUPABASE_*` variables in Workers **Build variables**
(they are needed when Vite builds, not as runtime Worker secrets). The checked-in
`.env` currently provides these public values as defaults. Never add private
backend keys to the frontend. Keep the backend active and verify admin login
and downloads before moving custom domains.
