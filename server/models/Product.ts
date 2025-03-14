import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IVariant {
  size: string;
  color: string;
  stock: number;
  price: number;
  sku: string;
  images?: string[];
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  vendorId: Types.ObjectId;
  category: string;
  images: string[];
  stock: number;
  isActive: boolean;
}

export interface IProductDocument extends IProduct, Document {}

const variantSchema = new Schema<IVariant>({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  price: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true },
  images: [String],
});

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    images: [{
      type: String,
      required: true
    }],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ vendorId: 1 });
productSchema.index({ price: 1 });

export const Product = mongoose.model<IProductDocument>('Product', productSchema); 