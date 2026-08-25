<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default output preferences
    |--------------------------------------------------------------------------
    */

    'defaults' => [
        'image_format' => 'webp',
        'fallback_format' => 'jpg',
        'quality' => 82,
        'max_upload_kilobytes' => 8192,
        'max_source_width' => 6000,
        'max_source_height' => 6000,
        'max_source_pixels' => 24_000_000,
    ],

    /*
    |--------------------------------------------------------------------------
    | Media profiles
    |--------------------------------------------------------------------------
    |
    | One shared processor reads these profiles. Module code should only pass
    | a profile key — never hard-code dimensions or disks in controllers.
    |
    */

    'profiles' => [

        'tour_cover' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/tours/covers',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 8192,
            'max_source_width' => 6000,
            'max_source_height' => 6000,
            'max_source_pixels' => 24_000_000,
            'aspect_ratio' => '3:2',
            'fit' => 'cover',
            'output_format' => 'webp',
            'fallback_format' => 'jpg',
            'quality' => 82,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'card' => ['width' => 800, 'height' => 533],
                'detail' => ['width' => 1600, 'height' => 1067],
            ],
        ],

        'blog_cover' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/articles/covers',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 8192,
            'max_source_width' => 6000,
            'max_source_height' => 6000,
            'max_source_pixels' => 24_000_000,
            'aspect_ratio' => '16:10',
            'fit' => 'cover',
            'output_format' => 'webp',
            'fallback_format' => 'jpg',
            'quality' => 82,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'card' => ['width' => 800, 'height' => 500],
                'detail' => ['width' => 1600, 'height' => 1000],
            ],
        ],

        'team_avatar' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/team/avatars',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 4096,
            'max_source_width' => 4000,
            'max_source_height' => 4000,
            'max_source_pixels' => 12_000_000,
            'aspect_ratio' => null,
            'fit' => 'contain',
            'output_format' => 'webp',
            'fallback_format' => 'jpg',
            'quality' => 84,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'thumb' => ['width' => 160, 'height' => 160],
                'card' => ['width' => 480, 'height' => 600],
            ],
        ],

        'about_journey_image' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/about/journey',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 8192,
            'max_source_width' => 6000,
            'max_source_height' => 6000,
            'max_source_pixels' => 24_000_000,
            'aspect_ratio' => '4:3',
            'fit' => 'cover',
            'output_format' => 'webp',
            'fallback_format' => 'jpg',
            'quality' => 82,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'card' => ['width' => 900, 'height' => 675],
                'detail' => ['width' => 1600, 'height' => 1200],
            ],
        ],

        'gallery_image' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/gallery',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 10240,
            'max_source_width' => 7000,
            'max_source_height' => 7000,
            'max_source_pixels' => 30_000_000,
            'aspect_ratio' => null,
            'fit' => 'contain',
            'output_format' => 'webp',
            'fallback_format' => 'jpg',
            'quality' => 80,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'thumb' => ['width' => 400, 'height' => 400],
                'display' => ['width' => 1600, 'height' => 1600],
            ],
        ],

        'destination_cover' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/destinations/covers',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 8192,
            'max_source_width' => 6000,
            'max_source_height' => 6000,
            'max_source_pixels' => 24_000_000,
            'aspect_ratio' => '4:3',
            'fit' => 'cover',
            'output_format' => 'webp',
            'fallback_format' => 'jpg',
            'quality' => 82,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'card' => ['width' => 800, 'height' => 600],
                'detail' => ['width' => 1600, 'height' => 1200],
            ],
        ],

        'brand_logo' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/brand/logos',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 4096,
            'max_source_width' => 4000,
            'max_source_height' => 2000,
            'max_source_pixels' => 8_000_000,
            'aspect_ratio' => null,
            'fit' => 'contain',
            'output_format' => 'webp',
            'fallback_format' => 'png',
            'quality' => 90,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'display' => ['width' => 640, 'height' => 160],
            ],
        ],

        'product_image' => [
            'type' => 'image',
            'disk' => 'public',
            'directory' => 'media/products',
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_upload_kilobytes' => 8192,
            'max_source_width' => 6000,
            'max_source_height' => 6000,
            'max_source_pixels' => 24_000_000,
            'aspect_ratio' => '4:3',
            'fit' => 'cover',
            'output_format' => 'webp',
            'fallback_format' => 'jpg',
            'quality' => 82,
            'retain_original' => false,
            'visibility' => 'public',
            'variants' => [
                'card' => ['width' => 800, 'height' => 600],
                'detail' => ['width' => 1600, 'height' => 1200],
            ],
        ],

        'document_attachment' => [
            'type' => 'document',
            'disk' => 'local',
            'directory' => 'media/documents',
            'allowed_mimes' => [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png',
            ],
            'allowed_extensions' => ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
            'max_upload_kilobytes' => 12288,
            'retain_original' => true,
            'visibility' => 'private',
            'variants' => [],
        ],

    ],

];
