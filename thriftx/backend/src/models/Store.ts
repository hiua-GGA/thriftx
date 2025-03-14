import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IStoreSocial {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  pinterest?: string;
}

export interface IStore extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  description: string;
  logo: string;
  bannerImage: string;
  address: IStoreAddress;
  contactEmail: string;
  contactPhone: string;
  social: IStoreSocial;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  numReviews: number;
  policies: {
    returns: string;
    shipping: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StoreAddressSchema = new Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const StoreSocialSchema = new Schema({
  website: String,
  facebook: String,
  twitter: String,
  instagram: String,
  pinterest: String
});

const StoreSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a store name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
      unique: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    logo: {
      type: String,
      default: 'default-store-logo.jpg'
    },
    bannerImage: {
      type: String,
      default: 'default-store-banner.jpg'
    },
    address: StoreAddressSchema,
    contactEmail: {
      type: String,
      required: [true, 'Please add a contact email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    contactPhone: {
      type: String,
      required: [true, 'Please add a contact phone number']
    },
    social: StoreSocialSchema,
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    policies: {
      returns: {
        type: String,
        default: 'Standard 30-day return policy'
      },
      shipping: {
        type: String,
        default: 'Standard shipping rates apply'
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for products
StoreSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'vendor',
  justOne: false
});

export default mongoose.model<IStore>('Store', StoreSchema); 