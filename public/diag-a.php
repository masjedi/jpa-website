<?php

header('Content-Type: text/plain; charset=utf-8');
echo "DIAG-A OK\n";
echo 'PHP '.PHP_VERSION."\n";

$base = is_file(__DIR__.'/../jpa-website/artisan')
    ? __DIR__.'/../jpa-website'
    : __DIR__.'/..';

echo 'base='.$base."\n";
echo 'artisan='.(is_file($base.'/artisan') ? 'yes' : 'no')."\n";
echo 'autoload='.(is_file($base.'/vendor/autoload.php') ? 'yes' : 'no')."\n";
echo 'bootstrap='.(is_file($base.'/bootstrap/app.php') ? 'yes' : 'no')."\n";
echo 'env='.(is_file($base.'/.env') ? 'yes' : 'no')."\n";
echo 'storage_writable='.(is_writable($base.'/storage') ? 'yes' : 'no')."\n";
echo 'cache_writable='.(is_writable($base.'/bootstrap/cache') ? 'yes' : 'no')."\n";
