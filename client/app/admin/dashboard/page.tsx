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
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 200) + 50,
      users: Math.floor(Math.random() * 100) + 20,
      vendors: Math.floor(Math.random() * 10) + 2,
    });
  }
  return data;
};

const dailyData = generateDailyData();

const AdminDashboardPage = () => {
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
  const calculateTotal = (key: 'revenue' | 'orders' | 'users' | 'vendors') => {
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
  
  const revenueData = calculateTotal('revenue');
  const ordersData = calculateTotal('orders');
  const usersData = calculateTotal('users');
  const vendorsData = calculateTotal('vendors');
  
  // Top categories data
  const topCategories = [
    { name: 'Vintage Clothing', revenue: 12500 },
    { name: 'Accessories', revenue: 8700 },
    { name: 'Footwear', revenue: 7200 },
    { name: 'Outerwear', revenue: 6500 },
    { name: 'Denim', revenue: 5800 },
  ];
  
  // User acquisition data
  const userAcquisition = {
    labels: ['Organic Search', 'Social Media', 'Direct', 'Referral', 'Email'],
    data: [40, 25, 15, 12, 8],
  };
  
  return (
    <DashboardLayout 
      userRole="admin" 
      userName="Admin User" 
      userAvatar="/images/admin-avatar.jpg"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Platform overview and performance metrics
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={`$${revenueData.total.toLocaleString()}`}
          icon={<DollarIcon className="w-6 h-6" />}
          change={revenueData.change}
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
          title="Active Users"
          value={usersData.total}
          icon={<UsersIcon className="w-6 h-6" />}
          change={usersData.change}
          footer={`${Math.round(usersData.total / filteredData.length)} new users per day`}
          color="secondary"
        />
        
        <StatCard
          title="Vendors"
          value={vendorsData.total}
          icon={<StoreIcon className="w-6 h-6" />}
          change={vendorsData.change}
          footer={`${Math.round((ordersData.total / vendorsData.total))} orders per vendor`}
          color="success"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <LineChart
            title="Revenue Trend"
            labels={filteredData.map(item => item.date)}
            datasets={[
              {
                label: 'Revenue ($)',
                data: filteredData.map(item => item.revenue),
                borderColor: 'rgba(14, 165, 233, 1)',
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                fill: true,
              },
            ]}
            height={300}
          />
        </div>
        
        {/* Orders & Users Trend Chart */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <LineChart
            title="Orders & Users"
            labels={filteredData.map(item => item.date)}
            datasets={[
              {
                label: 'Orders',
                data: filteredData.map(item => item.orders),
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
              },
              {
                label: 'New Users',
                data: filteredData.map(item => item.users),
                borderColor: 'rgba(217, 70, 239, 1)',
                backgroundColor: 'rgba(217, 70, 239, 0.5)',
              },
            ]}
            height={300}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Categories by Revenue */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Top Categories by Revenue</h3>
          <BarChart
            title=""
            labels={topCategories.map(category => category.name)}
            datasets={[
              {
                label: 'Revenue ($)',
                data: topCategories.map(category => category.revenue),
                backgroundColor: 'rgba(14, 165, 233, 0.7)',
              },
            ]}
            height={300}
            vertical={false}
          />
        </div>
        
        {/* User Acquisition */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">User Acquisition</h3>
          <DoughnutChart
            title=""
            labels={userAcquisition.labels}
            data={userAcquisition.data}
            height={300}
          />
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <a href="/admin/activity" className="text-primary-600 hover:underline text-sm">
            View All
          </a>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                index % 4 === 0 
                  ? 'bg-blue-100 text-blue-600' 
                  : index % 4 === 1 
                    ? 'bg-green-100 text-green-600' 
                    : index % 4 === 2
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-purple-100 text-purple-600'
              }`}>
                {index % 4 === 0 ? <UserPlusIcon className="w-5 h-5" /> : 
                 index % 4 === 1 ? <ShoppingBagIcon className="w-5 h-5" /> : 
                 index % 4 === 2 ? <StoreIcon className="w-5 h-5" /> : 
                 <AlertIcon className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900">
                    {index % 4 === 0 ? 'New user registered' : 
                     index % 4 === 1 ? 'New order placed' : 
                     index % 4 === 2 ? 'New vendor onboarded' : 
                     'Product reported'}
                  </p>
                  <span className="text-sm text-gray-500">
                    {format(subDays(new Date(), index), 'h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {index % 4 === 0 ? 'User123 joined the platform' : 
                   index % 4 === 1 ? 'Order #ORD-2345 for $129.99' : 
                   index % 4 === 2 ? 'Vintage Vibes store was approved' : 
                   'Vintage Denim Jacket reported for incorrect description'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Platform Health */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Server Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">API Response</span>
              <span className="text-sm font-medium text-green-600">210ms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-yellow-600">1.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '1.2%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Database Load</span>
              <span className="text-sm font-medium text-blue-600">42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;

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

const StoreIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const DownloadIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const UserPlusIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const AlertIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
); 