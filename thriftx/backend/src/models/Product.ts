import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant {
  size?: string;
  color?: string;
  material?: string;
  price: number;
  stock: number;
  sku: string;
  images: string[];
}

export interface IReview {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  brand: string;
  category: string;
  vendor: mongoose.Types.ObjectId;
  basePrice: number;
  variants: IProductVariant[];
  featuredImage: string;
  images: string[];
  reviews: IReview[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema({
  size: String,
  color: String,
  material: String,
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  sku: {
    type: String,
    required: true
  },
  images: [String]
});

const ReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand']
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      index: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    basePrice: {
      type: Number,
      required: [true, 'Please add a base price'],
      min: [0, 'Price must be positive']
    },
    variants: [ProductVariantSchema],
    featuredImage: {
      type: String,
      required: [true, 'Please add a featured image']
    },
    images: [String],
    reviews: [ReviewSchema],
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    tags: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for search
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema); 