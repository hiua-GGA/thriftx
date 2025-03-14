import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from './Order';
import { IUser } from './User';

export enum ShipmentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned'
}

interface ITrackingUpdate {
  status: ShipmentStatus;
  location: string;
  timestamp: Date;
  description: string;
}

export interface IShipment extends Document {
  order: mongoose.Types.ObjectId | IOrder;
  vendor: mongoose.Types.ObjectId | IUser;
  customer: mongoose.Types.ObjectId | IUser;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  shippingLabel?: string;
  packageDetails: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    numberOfPackages: number;
  };
  origin: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  destination: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingHistory: ITrackingUpdate[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const trackingUpdateSchema = new Schema<ITrackingUpdate>({
  status: {
    type: String,
    enum: Object.values(ShipmentStatus),
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const shipmentSchema = new Schema<IShipment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    carrier: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ShipmentStatus),
      default: ShipmentStatus.PENDING,
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    actualDeliveryDate: Date,
    shippingLabel: String,
    packageDetails: {
      weight: {
        type: Number,
        required: true,
      },
      dimensions: {
        length: {
          type: Number,
          required: true,
        },
        width: {
          type: Number,
          required: true,
        },
        height: {
          type: Number,
          required: true,
        },
      },
      numberOfPackages: {
        type: Number,
        required: true,
        default: 1,
      },
    },
    origin: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    destination: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    trackingHistory: [trackingUpdateSchema],
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ order: 1 });
shipmentSchema.index({ vendor: 1 });
shipmentSchema.index({ customer: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ carrier: 1 });
shipmentSchema.index({ estimatedDeliveryDate: 1 });
shipmentSchema.index({ createdAt: -1 });

export const Shipment = mongoose.model<IShipment>('Shipment', shipmentSchema); 