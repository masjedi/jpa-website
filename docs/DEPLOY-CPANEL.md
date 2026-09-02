# Deploy to cPanel

Production checklist for Journey to Peace Afghanistan Tours (Laravel + Inertia + React).

## Requirements

- PHP **8.3+** with extensions: `mbstring`, `openssl`, `pdo_mysql`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `bcmath`, `intl`
- MySQL / MariaDB database
- Apache document root pointed at the app `public/` folder
- SSL certificate enabled for the domain

## 1. Build the upload package (on your PC)

From the project root:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
npm run package:cpanel
```

This creates `dist/jpa-website-cpanel.zip` with production assets and without local junk.

If you prefer manual upload, include:

- `app/`, `bootstrap/`, `config/`, `database/`, `public/` (with `public/build/`), `resources/views/`, `routes/`, `storage/` structure, `vendor/`, `artisan`, `composer.json`, `composer.lock`
- Exclude: `.env`, `node_modules/`, `tests/`, `resources/js/`, `resources/css/`, `.git/`, `.cursor/`, `docs/`, `public/hot`

## 2. Upload and extract

1. Upload the zip to your cPanel account (outside or inside `public_html` as you prefer).
2. Extract it.
3. In cPanel **Domains / Document Root**, set the domain root to the app’s `public` directory  
   (example: `home/USER/jpa-website/public`).

## 3. Create production `.env`

1. Copy `.env.production.example` to `.env` on the server.
2. Fill in:
   - `APP_URL=https://your-domain.com`
   - `APP_KEY=` (generate in the next step)
   - MySQL credentials from cPanel
   - SMTP mailbox credentials
   - A strong `ADMIN_PASSWORD` (only needed if you seed the admin user)
3. Never upload your local `.env`.

## 4. Server commands (cPanel Terminal / SSH)

```bash
cd ~/path-to-app

php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Create the first admin user (preferred):

```bash
php artisan db:seed --class=AdminUserSeeder --force
```

Or set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` first, then run that seeder.

Do **not** run the full `DatabaseSeeder` on production unless you intentionally want demo tours/content.

## 5. Queue worker (required for booking emails)

Booking confirmation emails are queued (`QUEUE_CONNECTION=database`).

Add a cPanel **Cron Job** (every minute):

```bash
cd /home/USER/path-to-app && php artisan queue:work database --stop-when-empty --max-time=55 >> /dev/null 2>&1
```

If you cannot run cron, set:

```env
QUEUE_CONNECTION=sync
```

Emails will send during form submit (slower, but no worker needed).

## 6. Permissions

Ensure these are writable by PHP:

- `storage/`
- `bootstrap/cache/`

Typical cPanel: `755` for folders, `644` for files (or `775` if your host requires group write).

## 7. Post-launch checks

- [ ] `https://your-domain.com/up` returns OK
- [ ] Homepage CSS/JS load (no Vite “hot” errors)
- [ ] `/admin/login` works
- [ ] Custom booking form submits and emails arrive
- [ ] Uploaded images appear (`storage:link` worked)
- [ ] `robots.txt` allows public pages and blocks `/admin`
- [ ] Update the `Sitemap:` line in `public/robots.txt` to the full URL if your host requires it:
  `Sitemap: https://your-domain.com/sitemap.xml`

## Do not upload

| Path | Why |
|------|-----|
| `.env` | Local secrets |
| `public/hot` | Forces Vite dev mode and breaks assets |
| `node_modules/` | Not needed after `npm run build` |
| `tests/` | Not needed at runtime |
| `.git/`, `.cursor/`, `docs/` | Dev-only |
| `storage/logs/*.log` | Local noise |

## Rollback tip

Keep the previous zip on the server before replacing files. Clear caches after any `.env` change:

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
