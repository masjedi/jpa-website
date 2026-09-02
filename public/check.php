<?php

header('Content-Type: text/plain; charset=utf-8');

$home = dirname(__DIR__);
$candidates = [
    $home.'/jpa-website', // preferred for cPanel main domain
    $home,                // normal: .../jpa-website/public
];

$root = null;
foreach ($candidates as $candidate) {
    if (
        is_file($candidate.'/artisan')
        && is_file($candidate.'/vendor/autoload.php')
        && is_file($candidate.'/bootstrap/app.php')
        && is_file($candidate.'/.env')
    ) {
        $root = $candidate;
        break;
    }
}

echo "OK\n";
echo 'PHP '.phpversion()."\n";
echo 'File '.__FILE__."\n";
echo 'Detected app root: '.($root ?? 'NOT FOUND')."\n";
echo 'vendor '.(($root && is_file($root.'/vendor/autoload.php')) ? 'yes' : 'no')."\n";
echo 'env '.(($root && is_file($root.'/.env')) ? 'yes' : 'no')."\n";
