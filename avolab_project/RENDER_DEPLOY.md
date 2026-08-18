# AVOLAB Render Deployment

## Important
This app requires a Node.js runtime and a remotely accessible MySQL/MariaDB database. Do **not** use an InfinityFree free-hosting MySQL database from Render: InfinityFree states that remote MySQL connections are not available on free hosting.

## GitHub
- Commit the project without `.env`.
- `.gitignore` already excludes `.env*` except `.env.example`.

## Render
- Runtime: Node
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check: `/api/health`

Set these environment variables in Render:
- `NODE_ENV=production`
- `DB_HOST`
- `DB_PORT=3306`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `GEMINI_API_KEY`
- `APP_URL=https://<your-render-service>.onrender.com`

The server listens on Render's `PORT` automatically and binds to `0.0.0.0`.
