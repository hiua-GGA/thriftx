import { Request, Response } from 'express';
import { User } from '../models/User';

export const getStoreDetails = async (req: Request, res: Response) => {
  try {
    const vendor = await User.findById(req.user._id).select('-password');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json({ store: vendor.vendor });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store details', error });
  }
};

export const updateStoreDetails = async (req: Request, res: Response) => {
  try {
    const { storeName, storeDescription, businessEmail, businessPhone, businessAddress, taxId } = req.body;
    const vendor = await User.findByIdAndUpdate(
      req.user._id,
      { 'vendor.storeName': storeName, 'vendor.storeDescription': storeDescription, 'vendor.businessEmail': businessEmail, 'vendor.businessPhone': businessPhone, 'vendor.businessAddress': businessAddress, 'vendor.taxId': taxId },
      { new: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Store details updated', store: vendor.vendor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating store details', error });
  }
};

export const listVendorProducts = async (req: Request, res: Response) => {
  try {
    // Implement logic to fetch vendor products
    res.json({ message: 'List of vendor products' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor products', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Implement logic to create a new product
    res.json({ message: 'Product created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Implement logic to update a product
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Implement logic to delete a product
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
}; 