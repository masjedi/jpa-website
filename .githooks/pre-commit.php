<?php

/**
 * Fast local pre-commit checks. Slow/full validation runs in GitHub Actions.
 */

declare(strict_types=1);

$root = dirname(__DIR__);
chdir($root);

$php = PHP_BINARY;

/**
 * @return list<string>
 */
function stagedFiles(): array
{
    $output = [];
    exec('git diff --cached --name-only --diff-filter=ACMR', $output, $status);

    if ($status !== 0) {
        fwrite(STDERR, "pre-commit: unable to list staged files.\n");
        exit(1);
    }

    return array_values(array_filter($output, static fn (string $path): bool => $path !== ''));
}

/**
 * @param  list<string>  $command
 */
function run(array $command, string $failureMessage): void
{
    $escaped = implode(' ', array_map('escapeshellarg', $command));
    passthru($escaped, $status);

    if ($status !== 0) {
        fwrite(STDERR, "\npre-commit failed: {$failureMessage}\n");
        exit($status ?: 1);
    }
}

/**
 * @return list<string>
 */
function addedLines(string $path): array
{
    $output = [];
    exec('git diff --cached -U0 --no-color -- '.escapeshellarg($path), $output);

    $lines = [];

    foreach ($output as $line) {
        if (! str_starts_with($line, '+') || str_starts_with($line, '+++')) {
            continue;
        }

        $lines[] = substr($line, 1);
    }

    return $lines;
}

$files = stagedFiles();

if ($files === []) {
    exit(0);
}

$blockedNames = [
    '.env',
    '.env.backup',
    '.env.production',
    '.env.local',
    'auth.json',
    'credentials.json',
    'id_rsa',
    'id_dsa',
    'id_ecdsa',
    'id_ed25519',
];
$blockedSuffixes = ['.pem', '.p12', '.pfx', '.key'];
$debugPatterns = [
    'php' => '/\b(?:dd|dump|ray)\s*\(/',
    'js' => '/\bconsole\.log\s*\(/',
];
$secretPatterns = [
    '/BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY/',
    '/AKIA[0-9A-Z]{16}/',
];

$phpFiles = [];
$failures = [];

foreach ($files as $path) {
    $basename = basename($path);

    if (in_array($basename, $blockedNames, true) || $basename === '.env') {
        $failures[] = "blocked secret file: {$path}";
        continue;
    }

    if (str_starts_with($basename, '.env.')) {
        $isAllowedEnvTemplate = $basename === '.env.example'
            || str_ends_with($basename, '.example');

        if (! $isAllowedEnvTemplate) {
            $failures[] = "blocked environment file: {$path}";
            continue;
        }
    }

    foreach ($blockedSuffixes as $suffix) {
        if (str_ends_with(strtolower($basename), $suffix)) {
            $failures[] = "blocked credential/key file: {$path}";
            continue 2;
        }
    }

    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

    if ($extension === 'php') {
        $phpFiles[] = $path;
    }

    if (! is_file($path)) {
        continue;
    }

    $lines = addedLines($path);
    $patternKey = $extension === 'php' ? 'php' : (in_array($extension, ['ts', 'tsx', 'js', 'jsx'], true) ? 'js' : null);

    if ($patternKey !== null) {
        foreach ($lines as $line) {
            if (preg_match($debugPatterns[$patternKey], $line) === 1) {
                $failures[] = "debug statement in {$path}: {$line}";
            }
        }
    }

    foreach ($lines as $line) {
        foreach ($secretPatterns as $pattern) {
            if (preg_match($pattern, $line) === 1) {
                $failures[] = "possible secret in {$path}";
                break;
            }
        }
    }
}

if ($failures !== []) {
    fwrite(STDERR, "pre-commit failed:\n");

    foreach (array_unique($failures) as $failure) {
        fwrite(STDERR, "  - {$failure}\n");
    }

    fwrite(STDERR, "Fix the issues above, or unstage the files. Commit was blocked.\n");
    exit(1);
}

foreach ($phpFiles as $path) {
    run([$php, '-l', $path], "PHP syntax error in {$path}");
}

if ($phpFiles !== []) {
    $pint = $root.DIRECTORY_SEPARATOR.'vendor'.DIRECTORY_SEPARATOR.'bin'.DIRECTORY_SEPARATOR.'pint';

    if (! is_file($pint) && ! is_file($pint.'.bat')) {
        fwrite(STDERR, "pre-commit failed: Laravel Pint is missing. Run composer install.\n");
        exit(1);
    }

    run([$php, $pint, '--dirty', '--test'], 'PHP formatting check failed (vendor/bin/pint --dirty --test).');
}

exit(0);
