# Backend (Express + mysql2)

This backend is a minimal scaffold to connect your frontend and the filess.io MySQL database.

## Local setup

1. Copy `.env.example` to `.env` and fill in DB credentials and `JWT_SECRET`.
2. Install dependencies:
   - `cd backend && npm install`
3. Run in dev mode:
   - `npm run dev`
4. Test DB connectivity:
   - `npm run debug-db`
5. Health endpoint:
   - `GET http://localhost:3000/health` → `{ ok: true }`

## Included routes (basic)

- `POST /auth/register` - { name, email, password }
- `POST /auth/login` - { email, password } → returns `{ token }`
- `GET /elections` - list elections
- `POST /elections` - create (admin only, Authorization: Bearer <token>)
- `POST /votes` - cast vote (Authorization: Bearer <token>)
- `GET /auctions` - list auctions
- `POST /auctions/:id/bids` - place bid (Authorization: Bearer <token>)

## Deploy to Render

1. Push your repo to GitHub.
2. In Render: New → Web Service → connect the repo and branch (`main`).
3. Build command: `npm install`
   Start command: `npm start`
4. Add environment variables in Render (Service → Environment):
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_SSL` (true/false)
   - `DB_CONN_LIMIT=5`
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Deploy. Use Render Shell to run `npm run debug-db` to verify connection.

## Vercel config

- Set `VITE_API_URL` to your Render URL (e.g., `https://your-backend.onrender.com`) in Vercel Project Settings → Environment Variables.
- Redeploy frontend.

## Notes

- Keep `DB_CONN_LIMIT` small (e.g., 5) to avoid too many DB connections from serverless instances.
- Ensure filess.io accepts Render outbound connections (IP whitelist or public access as per filess docs).
- This scaffold is minimal; we can extend it with Socket.io, more routes, validations, reCAPTCHA verification, and tests next.
