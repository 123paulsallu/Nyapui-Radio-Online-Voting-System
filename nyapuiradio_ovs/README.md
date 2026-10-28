# Nyapui Radio OVS deployment

This repository contains two Vercel projects:

- `nyapuiradio_ovs`: the public Create React App site, deployed as static files.
- `nyapuiradio_adminovs`: the Next.js admin site and API. Vercel runs its pages and Route Handlers as serverless functions.

## Deploy on Vercel

Create two Vercel projects from this repository and set each project's **Root Directory** to its app folder.

For `nyapuiradio_adminovs`, use the Next.js framework preset and set these Production environment variables:

- `DATABASE_URL`: a production PostgreSQL connection string. Use the provider's pooled/serverless connection URL.
- `SESSION_SECRET`: a long, random secret used to sign admin sessions.
- `PUBLIC_APP_ORIGIN`: the exact HTTPS origin of the public site, for example `https://vote.example.com` (no path or trailing slash needed).

For `nyapuiradio_ovs`, use the Create React App preset, set the build command to `npm run build`, and the output directory to `build`. Set this build-time environment variable:

- `REACT_APP_API_URL`: the exact HTTPS origin of the admin project, for example `https://admin.example.com`.

Add custom domains so both projects share the same registrable domain, such as `vote.example.com` and `admin.example.com`. Do not use unrelated `*.vercel.app` domains in production: browser cookie policies can prevent the ballot cookie from working across sites. The API accepts credentialed requests only from `PUBLIC_APP_ORIGIN`.

## Database setup

Create the production PostgreSQL database before deploying. From `nyapuiradio_adminovs`, apply the schema against that database before opening the site:

```sh
DATABASE_URL="<production-pooled-postgres-url>" npm run db:push
```

Create the initial admin using the seed script from a trusted local machine. Put the database URL and optional `SEED_ADMIN_USERNAME`, `SEED_ADMIN_PASSWORD`, and `SEED_ADMIN_ROLE` values in `nyapuiradio_adminovs/.env`, then run:

```sh
npm run db:seed
```

Never commit `.env` or put database credentials in `REACT_APP_*` variables. `REACT_APP_*` values are included in the public browser bundle.

After deploying the admin project, set its URL as `REACT_APP_API_URL` in the public project and redeploy the public project. Set `PUBLIC_APP_ORIGIN` to the final public custom domain before deploying the admin project.