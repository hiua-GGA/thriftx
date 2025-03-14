import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { processImage } from '../services/image.service';

// Get all products for a vendor
export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ vendorId: req.user._id });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Add a new product
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      description, 
      brand, 
      category, 
      subcategory, 
      variants, 
      basePrice, 
      discountPercentage, 
      tags, 
      mainImage, 
      images, 
      specifications,
      virtualTryOnEnabled
    } = req.body;

    // Create new product
    const product = new Product({
      name,
      description,
      vendorId: req.user._id,
      brand,
      category,
      subcategory,
      variants,
      basePrice,
      discountPercentage,
      tags,
      mainImage,
      images,
      specifications,
      virtualTryOnEnabled: virtualTryOnEnabled || false
    });

    // Process images if they exist
    if (mainImage) {
      const enhancedMainImage = await processImage(mainImage);
      if (enhancedMainImage) {
        product.enhancedImages = [enhancedMainImage];
      }
    }

    if (images && images.length > 0) {
      const enhancedImages = await Promise.all(
        images.map(async (image: string) => {
          return await processImage(image);
        })
      );
      
      // Filter out any null values from failed processing
      const validEnhancedImages = enhancedImages.filter(img => img !== null);
      if (validEnhancedImages.length > 0) {
        product.enhancedImages = [...(product.enhancedImages || []), ...validEnhancedImages];
      }
    }

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

// Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { 
      name, 
      description, 
      brand, 
      category, 
      subcategory, 
      variants, 
      basePrice, 
      discountPercentage, 
      tags, 
      mainImage, 
      images, 
      specifications,
      virtualTryOnEnabled,
      isActive
    } = req.body;

    // Find the product
    const product = await Product.findOne({ _id: productId, vendorId: req.user._id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or you do not have permission to edit it' });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subcategory = subcategory;
    product.variants = variants || product.variants;
    product.basePrice = basePrice || product.basePrice;
    product.discountPercentage = discountPercentage;
    product.tags = tags || product.tags;
    product.specifications = specifications;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    product.virtualTryOnEnabled = virtualTryOnEnabled !== undefined ? virtualTryOnEnabled : product.virtualTryOnEnabled;

    // Process new images if they exist
    if (mainImage && mainImage !== product.mainImage) {
      product.mainImage = mainImage;
      const enhancedMainImage = await processImage(mainImage);
      if (enhancedMainImage) {
        product.enhancedImages = [enhancedMainImage];
      }
    }

    if (images && images.length > 0 && JSON.stringify(images) !== JSON.stringify(product.images)) {
      product.images = images;
      const enhancedImages = await Promise.all(
        images.map(async (image: string) => {
          return await processImage(image);
        })
      );
      
      // Filter out any null values from failed processing
      const validEnhancedImages = enhancedImages.filter(img => img !== null);
      if (validEnhancedImages.length > 0) {
        product.enhancedImages = [...(product.enhancedImages || []), ...validEnhancedImages];
      }
    }

    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findOneAndDelete({ _id: productId, vendorId: req.user._id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or you do not have permission to delete it' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category, subcategory } = req.query;
    
    const query: any = { category, isActive: true };
    if (subcategory) {
      query.subcategory = subcategory;
    }
    
    const products = await Product.find(query);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error });
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const products = await Product.find(
      { 
        $text: { $search: query as string },
        isActive: true
      },
      { 
        score: { $meta: 'textScore' } 
      }
    ).sort({ score: { $meta: 'textScore' } });
    
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error });
  }
}; 