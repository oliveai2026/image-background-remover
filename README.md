# Image Background Remover

Remove image backgrounds instantly. Free, fast, no sign-up required.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Cloudflare Pages Functions
- **API:** Remove.bg

## Deploy to Cloudflare Pages

1. Fork or push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → Create a project → Connect GitHub
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable:
   - `REMOVE_BG_API_KEY` = your [Remove.bg API key](https://www.remove.bg/api)
5. Deploy

## Local Development

```bash
npm install
npm run dev
```

For local testing with the Worker function, use [Wrangler](https://developers.cloudflare.com/workers/wrangler/):

```bash
npx wrangler pages dev dist --binding REMOVE_BG_API_KEY=your_key
```
