import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

interface IDailySales {
  date: Date;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
}

interface IProductPerformance {
  productId: mongoose.Types.ObjectId;
  totalQuantitySold: number;
  totalRevenue: number;
  averageRating: number;
  returnRate: number;
}

interface ICategoryPerformance {
  category: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface ISalesAnalytics extends Document {
  vendor: mongoose.Types.ObjectId | IUser;
  period: {
    start: Date;
    end: Date;
  };
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: IDailySales[];
  topProducts: IProductPerformance[];
  categoryPerformance: ICategoryPerformance[];
  customerMetrics: {
    newCustomers: number;
    repeatCustomers: number;
    averageCustomerValue: number;
  };
  conversionRate: number;
  refundRate: number;
  shippingMetrics: {
    averageShippingCost: number;
    averageDeliveryTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const dailySalesSchema = new Schema<IDailySales>({
  date: {
    type: Date,
    required: true,
  },
  totalSales: {
    type: Number,
    required: true,
    default: 0,
  },
  orderCount: {
    type: Number,
    required: true,
    default: 0,
  },
  averageOrderValue: {
    type: Number,
    required: true,
    default: 0,
  },
});

const productPerformanceSchema = new Schema<IProductPerformance>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  totalQuantitySold: {
    type: Number,
    required: true,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0,
  },
  averageRating: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5,
  },
  returnRate: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 100,
  },
});

const categoryPerformanceSchema = new Schema<ICategoryPerformance>({
  category: {
    type: String,
    required: true,
  },
  totalSales: {
    type: Number,
    required: true,
    default: 0,
  },
  orderCount: {
    type: Number,
    required: true,
    default: 0,
  },
  averageOrderValue: {
    type: Number,
    required: true,
    default: 0,
  },
});

const salesAnalyticsSchema = new Schema<ISalesAnalytics>(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    period: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    totalOrders: {
      type: Number,
      required: true,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      required: true,
      default: 0,
    },
    dailySales: [dailySalesSchema],
    topProducts: [productPerformanceSchema],
    categoryPerformance: [categoryPerformanceSchema],
    customerMetrics: {
      newCustomers: {
        type: Number,
        required: true,
        default: 0,
      },
      repeatCustomers: {
        type: Number,
        required: true,
        default: 0,
      },
      averageCustomerValue: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    conversionRate: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    refundRate: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    shippingMetrics: {
      averageShippingCost: {
        type: Number,
        required: true,
        default: 0,
      },
      averageDeliveryTime: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
salesAnalyticsSchema.index({ vendor: 1 });
salesAnalyticsSchema.index({ 'period.start': 1, 'period.end': 1 });
salesAnalyticsSchema.index({ totalRevenue: -1 });
salesAnalyticsSchema.index({ 'topProducts.productId': 1 });
salesAnalyticsSchema.index({ createdAt: -1 });

export const SalesAnalytics = mongoose.model<ISalesAnalytics>('SalesAnalytics', salesAnalyticsSchema); 