<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default administrator account
    |--------------------------------------------------------------------------
    |
    | Used when seeding the primary dashboard user. Override in .env for
    | production deployments, or change email/password later from Admin → Account.
    |
    */

    'name' => env('ADMIN_NAME', 'JPA Administrator'),

    'email' => env('ADMIN_EMAIL', 'admin@journey-to-afghanistan.com'),

    'password' => env('ADMIN_PASSWORD', 'Admin!@#$1234'),

];
