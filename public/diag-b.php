<?php

use Illuminate\Contracts\Console\Kernel;

header('Content-Type: text/plain; charset=utf-8');
echo "DIAG-B start\n";
@ob_flush();
@flush();

$base = is_file(__DIR__.'/../jpa-website/artisan')
    ? __DIR__.'/../jpa-website'
    : __DIR__.'/..';

echo 'base='.$base."\n";
@ob_flush();
@flush();

require $base.'/vendor/autoload.php';
echo "autoload OK\n";
@ob_flush();
@flush();

$app = require $base.'/bootstrap/app.php';
echo "bootstrap OK\n";
@ob_flush();
@flush();

$kernel = $app->make(Kernel::class);
$kernel->bootstrap();
echo "kernel OK\n";
echo 'app_key='.(filled(config('app.key')) ? 'yes' : 'no')."\n";
echo 'db='.config('database.default')."\n";
echo "DIAG-B OK\n";
