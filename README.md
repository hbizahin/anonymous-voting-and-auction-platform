<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1J9Yjh6G8CtOMuMZpW3uvPCaGxUCRa5aI

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

---

## Deploy Database to PlanetScale (10 tables)

Follow these exact steps to create the database and run the 10-table SQL in PlanetScale:

1. Sign in to PlanetScale (https://app.planetscale.com) and click **Create database**. Choose a name (e.g., `anonymous_voting`) and region nearest to your users. Create a production branch (e.g., `main`).

2. Open your database in the PlanetScale Console and select the branch (e.g., `main`) → **Run SQL**.

3. Open the file `db/10_tables_planetscale.sql` in this repository and copy the entire SQL contents. Paste into the **Run SQL** editor in the PlanetScale Console and click **Run**. This will create the 10 tables:

   - `users`, `elections`, `candidates`, `votes`, `vote_receipts`, `auctions`, `bids`, `captcha_logs`, `admin_logs`, `sessions`.

4. (Optional) Use the PlanetScale CLI:

   - Install: `npm i -g @planetscale/cli`
   - Login: `pscale auth login`
   - You can use `pscale connect <db> <branch>` to open a secure tunnel and then run SQL using a local `mysql` client if you prefer.

5. After running the SQL, go to **Browse Data** (or **Schema**) in the PlanetScale Console to confirm the tables are present.

6. Create a password / connection string for production: In the Console → **Connect** → **Password** → Create Password. Copy the connection string and add it to your backend host (Render) as `DATABASE_URL`.

7. If you use Prisma, set `DATABASE_URL` to the PlanetScale string and run migrations in production as a one-off: `npx prisma migrate deploy` (generate migrations locally and deploy them in production).

---

If you want, I can also add a `PRISMA_SCHEMA.md` with a full `schema.prisma` translation of these tables or scaffold a minimal Express backend that uses this `DATABASE_URL` and runs `prisma migrate deploy` as a startup task.
