# Expense Tracker

Vite + React frontend with an Express and MongoDB backend.

## Local setup

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Install backend dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create env files from the examples:

   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```

4. Start the backend:

   ```bash
   cd server
   npm start
   ```

5. Start the frontend in another terminal:

   ```bash
   npm run dev
   ```

## Deploy backend on Render

1. Push this repo to GitHub.
2. In Render, create a new **Blueprint** from the repo. Render will use `render.yaml`.
3. Add these environment variables to the `expense-tracker-api` service:

   ```text
   Mongodb_Url=your MongoDB Atlas connection string
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. Deploy the service.
5. After deploy, confirm the API is live at:

   ```text
   https://your-render-service.onrender.com/api/health
   ```

## Deploy frontend on Vercel

1. In Vercel, import the same GitHub repo.
2. Keep the root directory as the repository root.
3. Use these build settings:

   ```text
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

4. Add this environment variable:

   ```text
   VITE_API_URL=https://your-render-service.onrender.com/api
   ```

5. Deploy the frontend.
6. Copy the Vercel production URL back into Render as `FRONTEND_URL`, then redeploy the Render service so CORS allows the frontend.

## Deployment notes

- `vercel.json` rewrites all frontend routes to `index.html`, so React Router URLs work after refresh.
- `render.yaml` deploys only the `server` folder as the API service.
- Do not commit real `.env` files or MongoDB credentials.
