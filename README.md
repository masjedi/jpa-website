# Journey to Peace Afghanistan Tours

Laravel 13 + Inertia + React tourism website and admin dashboard.

## Local development

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
php artisan serve
```

## Production (cPanel)

See **[docs/DEPLOY-CPANEL.md](docs/DEPLOY-CPANEL.md)**.

Quick package:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run package:cpanel
```

Upload `dist/jpa-website-cpanel.zip`, point the domain document root to `public/`, create `.env` from `.env.production.example`, then run the Artisan commands in the deploy guide.

## Important production notes

- Never deploy `public/hot` or your local `.env`
- Booking emails need a queue worker cron, or set `QUEUE_CONNECTION=sync`
- Use PHP 8.3+ and MySQL on cPanel
