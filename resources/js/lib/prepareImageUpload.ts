interface PrepareImageUploadOptions {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    maxBytesBeforeResize: number;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('The selected image could not be read.'));
        };

        image.src = url;
    });
}

function scaledDimensions(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
): { width: number; height: number } {
    const scale = Math.min(maxWidth / width, maxHeight / height, 1);

    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}

function replaceExtension(filename: string, extension: string): string {
    const base = filename.replace(/\.[^.]+$/, '');

    return `${base}.${extension}`;
}

/**
 * Downscale large photos in the browser before upload so shared hosting
 * spends less time in PHP GD and admin saves feel responsive.
 */
export async function prepareImageUpload(
    file: File,
    {
        maxWidth,
        maxHeight,
        quality,
        maxBytesBeforeResize,
    }: PrepareImageUploadOptions,
): Promise<File> {
    const image = await loadImageElement(file);
    const target = scaledDimensions(image.width, image.height, maxWidth, maxHeight);
    const needsResize = target.width < image.width || target.height < image.height;
    const needsCompress = file.size > maxBytesBeforeResize;

    if (!needsResize && !needsCompress) {
        return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;

    const context = canvas.getContext('2d');

    if (!context) {
        return file;
    }

    context.drawImage(image, 0, 0, target.width, target.height);

    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob) {
        return file;
    }

    return new File([blob], replaceExtension(file.name, 'jpg'), {
        type: 'image/jpeg',
        lastModified: Date.now(),
    });
}

export async function prepareHeroSlideImage(file: File): Promise<File> {
    return prepareImageUpload(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        maxBytesBeforeResize: 1_500_000,
    });
}
