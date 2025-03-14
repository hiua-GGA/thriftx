import { Request, Response } from 'express';
import { User } from '../models/User';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // Implement logic to fetch dashboard data
    res.json({ message: 'Admin dashboard data' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error });
  }
};

export const listPendingVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await User.find({ 'vendor.isVerified': false, role: 'vendor' }).select('-password');
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending vendors', error });
  }
};

export const verifyVendor = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findOneAndUpdate(
      { _id: vendorId, role: 'vendor' },
      { 'vendor.isVerified': true },
      { new: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor verified', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying vendor', error });
  }
}; 