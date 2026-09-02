<?php

declare(strict_types=1);
use Illuminate\Contracts\Console\Kernel;

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');

echo "SETUP SCRIPT VERSION: FORCE-V3\n";

$scriptDir = str_replace('\\', '/', dirname(__FILE__));
$parent = dirname($scriptDir);

// Always prefer jpa-website next to public_html
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

    if (! preg_match('/^APP_KEY=.+/m', $env) || preg_match('/^APP_KEY=\s*$/m', $env)) {
        $key = 'base64:'.base64_encode(random_bytes(32));
        $env = preg_match('/^APP_KEY=.*$/m', $env)
            ? preg_replace('/^APP_KEY=.*$/m', 'APP_KEY='.$key, $env, 1)
            : $env.PHP_EOL.'APP_KEY='.$key.PHP_EOL;
        file_put_contents($envPath, $env);
        $results[] = 'APP_KEY generated';
    } else {
        $results[] = 'APP_KEY already set';
    }

    $link = $scriptDir.'/storage';
    $target = $root.'/storage/app/public';
    if (! is_dir($target)) {
        mkdir($target, 0755, true);
    }
    if (is_link($link) || is_dir($link)) {
        $results[] = 'storage link exists';
    } elseif (@symlink($target, $link)) {
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
    echo "Delete this file now: public_html/setup-v3.php\n";
} catch (Throwable $e) {
    echo "SETUP FAILED\n".$e->getMessage()."\n".$e->getFile().':'.$e->getLine()."\n";
}
