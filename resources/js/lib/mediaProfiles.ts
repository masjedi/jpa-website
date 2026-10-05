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
        hint: 'Square or portrait photos work best. Images are shown in a circular team card (up to 480 × 600 px). Max 4096 KB.',
    },
    testimonial_avatar: {
        aspectRatio: '1:1',
        thumb: { width: 200, height: 200 },
        card: { width: 400, height: 400 },
        maxUploadKilobytes: 4096,
        hint: 'Square portrait photos work best. Shown in a circular testimonial carousel (up to 400 × 400 px). Max 4096 KB.',
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
    hero_slide: {
        aspectRatio: '16:9',
        thumb: { width: 640, height: 360 },
        hero_md: { width: 1920, height: 1080 },
        maxUploadKilobytes: 8192,
        hint: 'Full-screen hero backgrounds. Target 1920 × 1080 px (1080p). Larger uploads are resized automatically. Max 8192 KB.',
    },
    document_attachment: {
        maxUploadKilobytes: 12288,
        maxFiles: 12,
        accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,.pdf,.doc,.docx,.jpg,.jpeg,.png',
        hint: 'Allowed: PDF, DOC, DOCX, JPG, JPEG, PNG. Max 12288 KB.',
    },
} as const;

export type MediaProfileKey = keyof typeof mediaProfiles;
