<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| cPanel main-domain helper
|--------------------------------------------------------------------------
|
| If this file lives in public_html and the Laravel app is in ../jpa-website,
| point $base there. Otherwise use the normal ../ paths.
|
*/

$base = is_file(__DIR__.'/../jpa-website/artisan')
    ? __DIR__.'/../jpa-website'
    : __DIR__.'/..';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $base.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $base.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $base.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
