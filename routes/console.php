<?php

use Illuminate\Support\Facades\Schedule;

/*
| cPanel: either schedule every minute, or call queue:work directly.
|
| * * * * * cd /home/USER/path-to-app && php artisan schedule:run >> /dev/null 2>&1
|
| cd /home/USER/path-to-app && php artisan queue:work --stop-when-empty --max-time=55 >> /dev/null 2>&1
*/
Schedule::command('queue:work --stop-when-empty --max-time=55')
    ->everyMinute()
    ->withoutOverlapping(5);
