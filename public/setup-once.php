<?php

/**
 * One-time cPanel setup (no SSH/Terminal needed).
 * Place in public_html, then open /setup-once.php
 * DELETE immediately after SETUP OK.
 */

declare(strict_types=1);
use Illuminate\Contracts\Console\Kernel;

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');

echo "SETUP SCRIPT VERSION: FORCE-V3\n";
echo 'PHP '.PHP_VERSION."\n";
echo 'Script: '.__FILE__."\n";

$scriptDir = str_replace('\\', '/', dirname(__FILE__));
$parent = dirname($scriptDir);

// public_html layout: app lives at ../jpa-website
$candidates = [
    $parent.'/jpa-website',
    $parent,
];

$root = null;
foreach ($candidates as $candidate) {
    echo 'Checking: '.$candidate."\n";
    echo '  artisan='.(is_file($candidate.'/artisan') ? 'yes' : 'no')."\n";
    echo '  vendor='.(is_file($candidate.'/vendor/autoload.php') ? 'yes' : 'no')."\n";
    echo '  bootstrap='.(is_file($candidate.'/bootstrap/app.php') ? 'yes' : 'no')."\n";
    echo '  env='.(is_file($candidate.'/.env') ? 'yes' : 'no')."\n";

    if (
        is_file($candidate.'/artisan')
        && is_file($candidate.'/vendor/autoload.php')
        && is_file($candidate.'/bootstrap/app.php')
    ) {
        $root = $candidate;
        break;
    }
}

echo "\nApp root: ".($root ?? 'NOT FOUND')."\n\n";

if ($root === null) {
    echo "SETUP FAILED\nCould not find Laravel app.\n";
    echo "Confirm /home/journeytoafghani/jpa-website has artisan, vendor, bootstrap, .env\n";
    exit;
}

if (! is_file($root.'/.env')) {
    echo "SETUP FAILED\n.env missing in {$root}\n";
    exit;
}

try {
    require $root.'/vendor/autoload.php';
    $app = require $root.'/bootstrap/app.php';
    $kernel = $app->make(Kernel::class);
    $kernel->bootstrap();

    $results = [];
    $envPath = $root.'/.env';
    $env = file_get_contents($envPath);

    if ($env === false) {
        throw new RuntimeException('Could not read .env');
    }

    if (! preg_match('/^APP_KEY=.+/m', $env) || preg_match('/^APP_KEY=\s*$/m', $env)) {
        $key = 'base64:'.base64_encode(random_bytes(32));
        $env = preg_match('/^APP_KEY=.*$/m', $env)
            ? preg_replace('/^APP_KEY=.*$/m', 'APP_KEY='.$key, $env, 1)
            : $env.PHP_EOL.'APP_KEY='.$key.PHP_EOL;

        if (file_put_contents($envPath, $env) === false) {
            throw new RuntimeException('Could not write APP_KEY into .env');
        }
        $results[] = 'APP_KEY generated';
    } else {
        $results[] = 'APP_KEY already set';
    }

    $link = $scriptDir.'/storage';
    $target = $root.'/storage/app/public';

    if (! is_dir($target) && ! mkdir($target, 0755, true) && ! is_dir($target)) {
        throw new RuntimeException('Could not create storage/app/public');
    }

    if (is_link($link) || is_dir($link)) {
        $results[] = 'storage link exists';
    } elseif (function_exists('symlink') && @symlink($target, $link)) {
        $results[] = 'storage symlink created';
    } else {
        $results[] = 'Create symlink manually: '.$link.' -> '.$target;
    }

    $kernel->call('config:clear');
    $results[] = 'config:clear OK';
    $kernel->call('route:clear');
    $results[] = 'route:clear OK';
    $kernel->call('view:clear');
    $results[] = 'view:clear OK';

    echo "SETUP OK\n\n".implode("\n", $results)."\n\n";
    echo "IMPORTANT: Delete public_html/setup-once.php now.\n";
} catch (Throwable $e) {
    echo "SETUP FAILED\n".$e->getMessage()."\n".$e->getFile().':'.$e->getLine()."\n";
}
