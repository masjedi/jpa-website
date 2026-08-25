/**
 * Frontend mirrors of config/media.php upload guidance.
 * Keep in sync with server profiles — never hard-code sizes in forms.
 */
export const mediaProfiles = {
    tour_cover: {
        aspectRatio: '3:2',
        card: { width: 800, height: 533 },
        detail: { width: 1600, height: 1067 },
        maxUploadKilobytes: 8192,
        hint: 'Target 1600 × 1067 px (3:2). Larger uploads are cropped/resized automatically. Max 8192 KB.',
    },
    blog_cover: {
        aspectRatio: '16:10',
        card: { width: 800, height: 500 },
        detail: { width: 1600, height: 1000 },
        maxUploadKilobytes: 8192,
        hint: 'Target 1600 × 1000 px (16:10). Larger uploads are cropped/resized automatically. Max 8192 KB.',
    },
    team_avatar: {
        aspectRatio: null,
        thumb: { width: 160, height: 160 },
        card: { width: 480, height: 600 },
        maxUploadKilobytes: 4096,
        hint: 'Portrait or square photos work best. Images are scaled to fit the team card (up to 480 × 600 px). Max 4096 KB.',
    },
    about_journey_image: {
        aspectRatio: '4:3',
        card: { width: 900, height: 675 },
        detail: { width: 1600, height: 1200 },
        maxUploadKilobytes: 8192,
        hint: 'Target 1600 × 1200 px (4:3). Larger uploads are cropped/resized automatically. Max 8192 KB.',
    },
    gallery_image: {
        aspectRatio: null,
        thumb: { width: 400, height: 400 },
        display: { width: 1600, height: 1600 },
        maxUploadKilobytes: 10240,
        hint: 'Target up to 1600 × 1600 px. Larger uploads are resized automatically. Max 10240 KB.',
    },
    destination_cover: {
        aspectRatio: '4:3',
        card: { width: 800, height: 600 },
        detail: { width: 1600, height: 1200 },
        maxUploadKilobytes: 8192,
        hint: 'Target 1600 × 1200 px (4:3). Larger uploads are cropped/resized automatically. Max 8192 KB.',
    },
    product_image: {
        aspectRatio: '4:3',
        card: { width: 800, height: 600 },
        detail: { width: 1600, height: 1200 },
        maxUploadKilobytes: 8192,
        hint: 'Target 1600 × 1200 px (4:3). Larger uploads are cropped/resized automatically. Max 8192 KB.',
    },
} as const;

export type MediaProfileKey = keyof typeof mediaProfiles;
