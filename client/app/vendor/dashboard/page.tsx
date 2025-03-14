'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import LineChart from '@/components/dashboard/charts/LineChart';
import BarChart from '@/components/dashboard/charts/BarChart';
import DoughnutChart from '@/components/dashboard/charts/DoughnutChart';
import { format, subDays } from 'date-fns';

// Mock data for the dashboard
const generateDailyData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'MMM dd'),
      sales: Math.floor(Math.random() * 1000) + 500,
      orders: Math.floor(Math.random() * 50) + 10,
      visitors: Math.floor(Math.random() * 200) + 100,
    });
  }
  return data;
};

const dailyData = generateDailyData();

const VendorDashboardPage = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Filter data based on selected time range
  const filteredData = (() => {
    switch (timeRange) {
      case '7d':
        return dailyData.slice(-7);
      case '30d':
        return dailyData;
      case '90d':
        // In a real app, we would fetch 90 days of data
        return dailyData;
      default:
        return dailyData;
    }
  })();
  
  // Calculate totals and changes
  const calculateTotal = (key: 'sales' | 'orders' | 'visitors') => {
    const currentTotal = filteredData.reduce((sum, item) => sum + item[key], 0);
    
    // Calculate previous period for comparison
    const previousPeriodData = (() => {
      switch (timeRange) {
        case '7d':
          return dailyData.slice(-14, -7);
        case '30d':
          // This is just a mock, in a real app we would have more data
          return dailyData.slice(-60, -30);
        case '90d':
          // In a real app, we would fetch more historical data
          return dailyData;
        default:
          return dailyData;
      }
    })();
    
    const previousTotal = previousPeriodData.reduce((sum, item) => sum + item[key], 0) || 1; // Avoid division by zero
    const changePercentage = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
    
    return {
      total: currentTotal,
      change: {
        value: Math.abs(changePercentage),
        isPositive: changePercentage >= 0,
      },
    };
  };
  
  const salesData = calculateTotal('sales');
  const ordersData = calculateTotal('orders');
  const visitorsData = calculateTotal('visitors');
  
  // Top selling products data
  const topProducts = [
    { name: 'Vintage Denim Jacket', sales: 42 },
    { name: 'Retro Sneakers', sales: 38 },
    { name: 'Classic Leather Belt', sales: 29 },
    { name: 'Wool Peacoat', sales: 25 },
    { name: 'Silk Scarf', sales: 18 },
  ];
  
  // Sales by category data
  const salesByCategory = {
    labels: ['Clothing', 'Accessories', 'Footwear', 'Outerwear', 'Vintage'],
    data: [35, 25, 20, 15, 5],
  };
  
  return (
    <DashboardLayout 
      userRole="vendor" 
      userName="Vintage Treasures" 
      userAvatar="/images/sellers/vintage-treasures.jpg"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Vendor Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === '7d'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('7d')}
          >
            Last 7 days
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === '30d'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('30d')}
          >
            Last 30 days
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === '90d'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('90d')}
          >
            Last 90 days
          </button>
        </div>
        
        <button className="btn-outline py-1 px-3 text-sm">
          <DownloadIcon className="w-4 h-4 mr-1 inline-block" />
          Export Report
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value={`$${salesData.total.toLocaleString()}`}
          icon={<DollarIcon className="w-6 h-6" />}
          change={salesData.change}
          footer={`${filteredData.length} day period`}
          color="primary"
        />
        
        <StatCard
          title="Total Orders"
          value={ordersData.total}
          icon={<ShoppingBagIcon className="w-6 h-6" />}
          change={ordersData.change}
          footer={`${Math.round(ordersData.total / filteredData.length)} orders per day`}
          color="accent"
        />
        
        <StatCard
          title="Store Visitors"
          value={visitorsData.total}
          icon={<UsersIcon className="w-6 h-6" />}
          change={visitorsData.change}
          footer={`${Math.round((ordersData.total / visitorsData.total) * 100)}% conversion rate`}
          color="secondary"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <LineChart
            title="Sales Trend"
            labels={filteredData.map(item => item.date)}
            datasets={[
              {
                label: 'Sales ($)',
                data: filteredData.map(item => item.sales),
                borderColor: 'rgba(14, 165, 233, 1)',
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                fill: true,
              },
            ]}
            height={300}
          />
        </div>
        
        {/* Orders Trend Chart */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <LineChart
            title="Orders & Visitors"
            labels={filteredData.map(item => item.date)}
            datasets={[
              {
                label: 'Orders',
                data: filteredData.map(item => item.orders),
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
              },
              {
                label: 'Visitors',
                data: filteredData.map(item => item.visitors),
                borderColor: 'rgba(217, 70, 239, 1)',
                backgroundColor: 'rgba(217, 70, 239, 0.5)',
              },
            ]}
            height={300}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <BarChart
            title=""
            labels={topProducts.map(product => product.name)}
            datasets={[
              {
                label: 'Units Sold',
                data: topProducts.map(product => product.sales),
                backgroundColor: 'rgba(14, 165, 233, 0.7)',
              },
            ]}
            height={300}
            vertical={false}
          />
        </div>
        
        {/* Sales by Category */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <DoughnutChart
            title=""
            labels={salesByCategory.labels}
            data={salesByCategory.data}
            height={300}
          />
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <a href="/vendor/orders" className="text-primary-600 hover:underline text-sm">
            View All
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-{2000 + index}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    Customer {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {format(subDays(new Date(), index), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    ${(Math.random() * 100 + 50).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      index % 3 === 0 
                        ? 'bg-green-100 text-green-800' 
                        : index % 3 === 1 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'Processing' : 'Shipped'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboardPage;

// Icon components
const DollarIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const ShoppingBagIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const UsersIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const DownloadIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
); 