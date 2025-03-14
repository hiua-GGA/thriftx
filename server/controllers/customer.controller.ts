import { Request, Response } from 'express';
import { User } from '../models/User';

export const getProfileDetails = async (req: Request, res: Response) => {
  try {
    const customer = await User.findById(req.user._id).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ profile: customer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber, address } = req.body;
    const customer = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phoneNumber, address },
      { new: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Profile updated', profile: customer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    // Implement logic to fetch customer orders
    res.json({ message: 'List of customer orders' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    // Implement logic to fetch order details
    res.json({ message: 'Order details' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error });
  }
};

export const listWishlist = async (req: Request, res: Response) => {
  try {
    // Implement logic to fetch wishlist
    res.json({ message: 'Customer wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    // Implement logic to add product to wishlist
    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    // Implement logic to remove product from wishlist
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error });
  }
};

export const listAddresses = async (req: Request, res: Response) => {
  try {
    // Implement logic to fetch addresses
    res.json({ message: 'List of addresses' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    // Implement logic to add address
    res.json({ message: 'Address added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    // Implement logic to update address
    res.json({ message: 'Address updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    // Implement logic to delete address
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};

export default {
  getProfileDetails,
  updateProfile,
  listOrders,
  getOrderDetails,
  listWishlist,
  addToWishlist,
  removeFromWishlist,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
}; 