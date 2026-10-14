# apexturbineservices.com

## Admin CMS

The admin dashboard is available at `/admin`. Routes are declared in `frontend/src/router/AppRouter.jsx`. Start the API and Vite frontend in separate terminals:

```sh
cd backend && npm start
cd frontend && npm run dev
```

The backend uses the MySQL/MariaDB server included with XAMPP. Start **MySQL** from the XAMPP Control Panel and configure `backend/.env` with your XAMPP MySQL username/password (defaults: `root`, blank password). The checked-in example is `backend/.env.example`. The migration creates the `apex_turbine_cms` database and tables. Run `cd backend && npm run migrate`, then start the API with `npm start`. The local setup uses port `3002` because port `3001` was already occupied; `frontend/.env.local` points Axios to `http://localhost:3002`. The first migration creates `admin@admin.com` with password `123456`; change it from **Admin profile** after signing in. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before the first migration to choose different credentials. The frontend Axios modules live under `frontend/src/api`, and routing uses React Router DOM with admin routes in `frontend/src/router/AdminRouter.jsx`.

After switching the API from PostgreSQL to XAMPP MySQL, stop any previously running Node API process and restart it so port `3001` serves the MySQL-backed version.

The dashboard currently manages homepage hero/about copy, contact details, six service cards, four featured project cards (including each View Project link), and image uploads. Multer accepts JPG, PNG, WebP, and GIF uploads up to 8 MB and saves them in `backend/uploads`. The original bundled site, contact, and four project photos have been restored there and are served by the backend. Configure `PUBLIC_API_URL` for the public backend origin outside local development.
