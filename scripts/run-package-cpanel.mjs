import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(root, 'package-cpanel.ps1');
const shell = process.env.SystemRoot
    ? path.join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    : 'powershell';

const result = spawnSync(
    shell,
    ['-ExecutionPolicy', 'Bypass', '-File', script],
    { stdio: 'inherit', cwd: path.join(root, '..') },
);

process.exit(result.status ?? 1);
