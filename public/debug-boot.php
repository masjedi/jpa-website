<?php

declare(strict_types=1);
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Content-Type: text/plain; charset=utf-8');

function step(string $msg): void
{
    echo $msg."\n";
    if (function_exists('ob_flush')) {
        @ob_flush();
    }
    @flush();
}

step('STEP 1: script started');
step('PHP '.PHP_VERSION);
step('File '.__FILE__);

$base = is_file(__DIR__.'/../jpa-website/artisan')
    ? __DIR__.'/../jpa-website'
    : __DIR__.'/..';

step('STEP 2: base = '.$base);
step('autoload = '.(is_file($base.'/vendor/autoload.php') ? 'yes' : 'no'));
step('bootstrap = '.(is_file($base.'/bootstrap/app.php') ? 'yes' : 'no'));
step('env = '.(is_file($base.'/.env') ? 'yes' : 'no'));
step('storage writable = '.(is_writable($base.'/storage') ? 'yes' : 'no'));
step('cache writable = '.(is_writable($base.'/bootstrap/cache') ? 'yes' : 'no'));

try {
    step('STEP 3: require autoload');
    require $base.'/vendor/autoload.php';

    step('STEP 4: require bootstrap');
    $app = require $base.'/bootstrap/app.php';

    step('STEP 5: console bootstrap');
    $kernel = $app->make(Kernel::class);
    $kernel->bootstrap();

    step('STEP 6: env APP_KEY set = '.(filled(config('app.key')) ? 'yes' : 'no'));
    step('STEP 7: DB config = '.config('database.default'));

    try {
        DB::connection()->getPdo();
        step('STEP 8: database = connected');
    } catch (Throwable $dbError) {
        step('STEP 8: database FAILED');
        step($dbError->getMessage());
    }

    step('STEP 9: HTTP handle');
    $http = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $request = Request::create('/', 'GET');
    $response = $http->handle($request);
    step('STEP 10: HTTP status = '.$response->getStatusCode());
    step('BOOT PATH OK');
} catch (Throwable $e) {
    step('FAILED');
    step($e::class);
    step($e->getMessage());
    step($e->getFile().':'.$e->getLine());
    step($e->getTraceAsString());
}
