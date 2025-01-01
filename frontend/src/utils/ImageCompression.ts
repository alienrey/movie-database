import imageCompression from "browser-image-compression";

export const compressImage = async (file: File, onProgress = (progress: number) => {console.log(progress + "/100")}) => {
    const options = {
      maxSizeMB: 0.5, // Max size in MB
      maxWidthOrHeight: 1920, // Optional: Max width or height
      useWebWorker: true,
      onprogress: onProgress,
    };
  
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
    }
  };