import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

export async function compressImageToWebP(
  file: File,
  options?: CompressionOptions
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 0.8, // Maximum 800 KB
    maxWidthOrHeight: 1920, // Max 1080p / 2K dimensions
    useWebWorker: true,
    fileType: 'image/webp',
    ...options,
  };

  try {
    const compressedBlob = await imageCompression(file, defaultOptions);
    // Format filename to .webp
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const newFileName = `${originalName}.webp`;
    return new File([compressedBlob], newFileName, { type: 'image/webp' });
  } catch (error) {
    console.warn('Image compression fallback to original file:', error);
    return file;
  }
}
