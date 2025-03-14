import sharp from 'sharp';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

class ImageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '../../public/uploads/products');
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Process and enhance an image with specified options
   * @param imageBuffer Buffer containing the image data
   * @param options Processing options (width, height, quality, format)
   * @returns Promise<string> Path to the processed image
   */
  async processImage(
    imageBuffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    const {
      width,
      height,
      quality = 80,
      format = 'webp'
    } = options;

    try {
      let imageProcessor = sharp(imageBuffer);

      // Resize if dimensions provided
      if (width || height) {
        imageProcessor = imageProcessor.resize(width, height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        });
      }

      // Apply basic enhancements
      imageProcessor = imageProcessor
        .normalize() // Normalize colors
        .modulate({ brightness: 1.05 }) // Slight brightness boost
        .sharpen() // Sharpen details
        .toFormat(format, { quality }); // Convert to specified format

      // Generate unique filename
      const filename = `${uuidv4()}.${format}`;
      const outputPath = path.join(this.uploadDir, filename);

      // Save processed image
      await imageProcessor.toFile(outputPath);

      return filename;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Process an image from a URL
   * @param imageUrl URL of the image to process
   * @param options Processing options
   * @returns Promise<string> Path to the processed image
   */
  async processImageFromUrl(
    imageUrl: string,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      const imageBuffer = Buffer.from(response.data, 'binary');
      return this.processImage(imageBuffer, options);
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error('Failed to download image from URL');
    }
  }

  /**
   * Process multiple images in batch
   * @param images Array of image buffers or URLs
   * @param options Processing options
   * @returns Promise<string[]> Array of processed image paths
   */
  async processBatchImages(
    images: (Buffer | string)[],
    options: ImageProcessingOptions = {}
  ): Promise<string[]> {
    try {
      const processedImages = await Promise.all(
        images.map(async (image) => {
          if (typeof image === 'string') {
            return this.processImageFromUrl(image, options);
          } else {
            return this.processImage(image, options);
          }
        })
      );
      return processedImages;
    } catch (error) {
      console.error('Error processing batch images:', error);
      throw new Error('Failed to process batch images');
    }
  }

  /**
   * Delete a processed image
   * @param filename Name of the file to delete
   */
  async deleteImage(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }
}

export const imageService = new ImageService();

/**
 * Virtual try-on processing
 * This is a placeholder for virtual try-on functionality
 * You would typically integrate with a specialized API or ML model
 */
export const processVirtualTryOn = async (
  productImage: string,
  userImage: string
): Promise<string | null> => {
  try {
    // Placeholder for virtual try-on processing
    // In a real implementation, you would:
    // 1. Send images to virtual try-on API
    // 2. Process the response
    // 3. Return the URL of the generated image
    
    // For now, return the original product image
    return productImage;
  } catch (error) {
    console.error('Error processing virtual try-on:', error);
    return null;
  }
}; 