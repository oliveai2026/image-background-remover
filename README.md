# Image Background Remover

Remove image backgrounds instantly. Free, fast, no sign-up required.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Route (Edge Runtime)
- **API:** Remove.bg
- **Deploy:** Cloudflare Pages

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → Create a project → Connect GitHub
3. Build settings:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add environment variable:
   - `REMOVE_BG_API_KEY` = your [Remove.bg API key](https://www.remove.bg/api)
5. Deploy

## Local Development

```bash
npm install
npm run dev
```
