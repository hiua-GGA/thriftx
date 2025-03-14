'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LineChart from '@/components/dashboard/charts/LineChart';
import BarChart from '@/components/dashboard/charts/BarChart';
import DoughnutChart from '@/components/dashboard/charts/DoughnutChart';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Define types for our data
interface MonthlyDataItem {
  month: string;
  sales: number;
  orders: number;
  averageOrderValue: number;
  returnRate: number;
}

const generateMonthlyData = (): MonthlyDataItem[] => {
  const data: MonthlyDataItem[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    data.push({
      month: format(date, 'MMM yyyy'),
      sales: Math.floor(Math.random() * 15000) + 5000,
      orders: Math.floor(Math.random() * 300) + 100,
      averageOrderValue: Math.floor(Math.random() * 50) + 50,
      returnRate: Math.random() * 5,
    });
  }
  return data;
};

const generateDemographicsData = () => {
  return {
    age: {
      labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      data: [15, 30, 25, 18, 8, 4],
    },
    gender: {
      labels: ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
      data: [55, 40, 3, 2],
    },
    location: {
      labels: ['North America', 'Europe', 'Asia', 'Australia', 'South America', 'Africa'],
      data: [45, 25, 15, 8, 5, 2],
    },
  };
};

const generateProductPerformanceData = () => {
  return [
    { name: 'Vintage Denim Jacket', sales: 142, revenue: 7100, views: 2840, conversionRate: 5.0 },
    { name: 'Retro Sneakers', sales: 118, revenue: 5900, views: 2360, conversionRate: 5.0 },
    { name: 'Classic Leather Belt', sales: 89, revenue: 2670, views: 1780, conversionRate: 5.0 },
    { name: 'Wool Peacoat', sales: 75, revenue: 6750, views: 1500, conversionRate: 5.0 },
    { name: 'Silk Scarf', sales: 68, revenue: 2040, views: 1360, conversionRate: 5.0 },
    { name: 'Vintage Sunglasses', sales: 62, revenue: 1860, views: 1240, conversionRate: 5.0 },
    { name: 'Leather Messenger Bag', sales: 54, revenue: 5400, views: 1080, conversionRate: 5.0 },
    { name: 'Cashmere Sweater', sales: 48, revenue: 4320, views: 960, conversionRate: 5.0 },
    { name: 'Vintage Watch', sales: 42, revenue: 8400, views: 840, conversionRate: 5.0 },
    { name: 'Linen Shirt', sales: 38, revenue: 1900, views: 760, conversionRate: 5.0 },
  ].map(product => ({
    ...product,
    conversionRate: ((product.sales / product.views) * 100).toFixed(1),
  }));
};

const monthlyData = generateMonthlyData();
const demographicsData = generateDemographicsData();
const productPerformanceData = generateProductPerformanceData();

const VendorAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');
  const [selectedMetric, setSelectedMetric] = useState<'sales' | 'orders' | 'averageOrderValue' | 'returnRate'>('sales');
  
  // Filter data based on selected time range
  const filteredData = (() => {
    switch (timeRange) {
      case '3m':
        return monthlyData.slice(-3);
      case '6m':
        return monthlyData.slice(-6);
      case '12m':
        return monthlyData;
      default:
        return monthlyData.slice(-6);
    }
  })();
  
  // Metric labels and formatting
  const metricConfig = {
    sales: {
      label: 'Sales Revenue',
      format: (value: number) => `$${value.toLocaleString()}`,
      color: 'rgba(14, 165, 233, 1)',
      bgColor: 'rgba(14, 165, 233, 0.2)',
    },
    orders: {
      label: 'Order Count',
      format: (value: number) => value.toString(),
      color: 'rgba(245, 158, 11, 1)',
      bgColor: 'rgba(245, 158, 11, 0.2)',
    },
    averageOrderValue: {
      label: 'Average Order Value',
      format: (value: number) => `$${value.toLocaleString()}`,
      color: 'rgba(139, 92, 246, 1)',
      bgColor: 'rgba(139, 92, 246, 0.2)',
    },
    returnRate: {
      label: 'Return Rate',
      format: (value: number) => `${value.toFixed(1)}%`,
      color: 'rgba(239, 68, 68, 1)',
      bgColor: 'rgba(239, 68, 68, 0.2)',
    },
  };
  
  // Calculate period-over-period change
  const calculateChange = () => {
    const currentPeriodData = [...filteredData];
    let previousPeriodData: MonthlyDataItem[] = [];
    
    switch (timeRange) {
      case '3m':
        previousPeriodData = monthlyData.slice(-6, -3);
        break;
      case '6m':
        previousPeriodData = monthlyData.slice(-12, -6);
        break;
      case '12m':
        // For 12m, we don't have previous data in our mock
        previousPeriodData = [];
        break;
      default:
        previousPeriodData = [];
    }
    
    const currentTotal = currentPeriodData.reduce((sum, item) => sum + item[selectedMetric], 0);
    const previousTotal = previousPeriodData.length 
      ? previousPeriodData.reduce((sum, item) => sum + item[selectedMetric], 0) 
      : 0;
    
    if (previousTotal === 0) return { value: 0, isPositive: true };
    
    const changePercentage = ((currentTotal - previousTotal) / previousTotal) * 100;
    
    return {
      value: Math.abs(changePercentage).toFixed(1),
      isPositive: changePercentage >= 0,
    };
  };
  
  const periodChange = calculateChange();
  
  return (
    <DashboardLayout 
      userRole="vendor" 
      userName="Vintage Treasures" 
      userAvatar="/images/sellers/vintage-treasures.jpg"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Store Analytics</h1>
        <p className="text-gray-600">
          Detailed insights and performance metrics for your store
        </p>
      </div>
      
      {/* Time Range and Metric Selectors */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === '3m'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('3m')}
          >
            Last 3 months
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === '6m'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('6m')}
          >
            Last 6 months
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === '12m'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('12m')}
          >
            Last 12 months
          </button>
        </div>
        
        <div className="flex space-x-2">
          <select 
            className="px-3 py-1 rounded-md text-sm font-medium bg-white border border-gray-300"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
          >
            <option value="sales">Sales Revenue</option>
            <option value="orders">Order Count</option>
            <option value="averageOrderValue">Average Order Value</option>
            <option value="returnRate">Return Rate</option>
          </select>
          
          <button className="btn-outline py-1 px-3 text-sm">
            <DownloadIcon className="w-4 h-4 mr-1 inline-block" />
            Export Data
          </button>
        </div>
      </div>
      
      {/* Main Metric Chart */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{metricConfig[selectedMetric].label} Trend</h3>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold mr-2">
                {metricConfig[selectedMetric].format(
                  filteredData.reduce((sum, item) => sum + item[selectedMetric], 0)
                )}
              </span>
              {periodChange.value !== '0' && (
                <span className={`flex items-center text-sm ${
                  periodChange.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {periodChange.isPositive ? (
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {periodChange.value}% vs previous period
                </span>
              )}
            </div>
          </div>
        </div>
        
        <LineChart
          title=""
          labels={filteredData.map(item => item.month)}
          datasets={[
            {
              label: metricConfig[selectedMetric].label,
              data: filteredData.map(item => item[selectedMetric]),
              borderColor: metricConfig[selectedMetric].color,
              backgroundColor: metricConfig[selectedMetric].bgColor,
              fill: true,
            },
          ]}
          height={300}
        />
      </div>
      
      {/* Customer Demographics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Customer Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Age Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h4 className="text-base font-medium mb-4">Age Distribution</h4>
            <DoughnutChart
              title=""
              labels={demographicsData.age.labels}
              data={demographicsData.age.data}
              height={220}
            />
          </div>
          
          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h4 className="text-base font-medium mb-4">Gender Distribution</h4>
            <DoughnutChart
              title=""
              labels={demographicsData.gender.labels}
              data={demographicsData.gender.data}
              height={220}
            />
          </div>
          
          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h4 className="text-base font-medium mb-4">Geographic Distribution</h4>
            <DoughnutChart
              title=""
              labels={demographicsData.location.labels}
              data={demographicsData.location.data}
              height={220}
            />
          </div>
        </div>
      </div>
      
      {/* Product Performance */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Product Performance</h3>
          <a href="/vendor/products" className="text-primary-600 hover:underline text-sm">
            View All Products
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productPerformanceData.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {product.sales}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {product.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm ${
                        parseFloat(product.conversionRate) > 4 
                          ? 'text-green-600' 
                          : parseFloat(product.conversionRate) > 2 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {product.conversionRate}%
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseFloat(product.conversionRate) > 4 
                              ? 'bg-green-500' 
                              : parseFloat(product.conversionRate) > 2 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${Math.min(parseFloat(product.conversionRate) * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <BarChart
            title=""
            labels={['Clothing', 'Accessories', 'Footwear', 'Outerwear', 'Vintage']}
            datasets={[
              {
                label: 'Sales ($)',
                data: [12500, 8700, 7200, 6500, 5800],
                backgroundColor: 'rgba(14, 165, 233, 0.7)',
              },
            ]}
            height={300}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Time of Day</h3>
          <BarChart
            title=""
            labels={['Morning', 'Afternoon', 'Evening', 'Night']}
            datasets={[
              {
                label: 'Orders',
                data: [125, 230, 305, 140],
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
              },
            ]}
            height={300}
          />
        </div>
      </div>
      
      {/* Customer Insights */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Repeat Purchase Rate</h4>
              <span className="text-green-600">
                <ArrowUpIcon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold">38%</p>
            <p className="text-xs text-gray-500 mt-1">+5% from last period</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Avg. Customer Value</h4>
              <span className="text-green-600">
                <ArrowUpIcon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold">$285</p>
            <p className="text-xs text-gray-500 mt-1">+12% from last period</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Cart Abandonment</h4>
              <span className="text-red-600">
                <ArrowDownIcon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold">68%</p>
            <p className="text-xs text-gray-500 mt-1">-3% from last period</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Avg. Session Duration</h4>
              <span className="text-green-600">
                <ArrowUpIcon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold">4m 32s</p>
            <p className="text-xs text-gray-500 mt-1">+45s from last period</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorAnalyticsPage;

// Icon components
const DownloadIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const ArrowUpIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const ArrowDownIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
); 