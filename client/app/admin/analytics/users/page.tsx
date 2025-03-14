'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LineChart from '@/components/dashboard/charts/LineChart';
import BarChart from '@/components/dashboard/charts/BarChart';
import DoughnutChart from '@/components/dashboard/charts/DoughnutChart';
import StatCard from '@/components/dashboard/StatCard';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Define types for our data
interface UserDataItem {
  date: string;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  churnRate: number;
  sessionDuration: number;
  pagesPerSession: number;
}

// Mock data generation
const generateUserData = (): UserDataItem[] => {
  const data: UserDataItem[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    
    data.push({
      date: format(date, 'MMM yyyy'),
      newUsers: Math.floor(Math.random() * 500) + 100,
      activeUsers: Math.floor(Math.random() * 2000) + 1000,
      returningUsers: Math.floor(Math.random() * 800) + 400,
      churnRate: Math.random() * 5 + 2,
      sessionDuration: Math.floor(Math.random() * 300) + 120, // in seconds
      pagesPerSession: Math.random() * 4 + 2,
    });
  }
  return data;
};

// Generate demographic data
const generateDemographicData = () => {
  return {
    age: {
      labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      data: [22, 35, 20, 12, 8, 3],
    },
    gender: {
      labels: ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
      data: [58, 38, 2, 2],
    },
    location: {
      labels: ['North America', 'Europe', 'Asia', 'Australia', 'South America', 'Africa'],
      data: [42, 28, 18, 6, 4, 2],
    },
    devices: {
      labels: ['Mobile', 'Desktop', 'Tablet'],
      data: [65, 28, 7],
    }
  };
};

// Generate acquisition data
const generateAcquisitionData = () => {
  return {
    channels: {
      labels: ['Organic Search', 'Social Media', 'Direct', 'Referral', 'Email', 'Paid Search'],
      data: [35, 25, 18, 12, 7, 3],
    },
    socialPlatforms: {
      labels: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'Twitter', 'Other'],
      data: [40, 25, 20, 8, 5, 2],
    }
  };
};

// Generate engagement data
const generateEngagementData = () => {
  return {
    mostVisitedPages: [
      { page: 'Home Page', visits: 12500, avgTime: 45 },
      { page: 'Vintage Clothing', visits: 8700, avgTime: 120 },
      { page: 'New Arrivals', visits: 7200, avgTime: 95 },
      { page: 'Sale Items', visits: 6500, avgTime: 85 },
      { page: 'Accessories', visits: 5800, avgTime: 75 },
    ],
    userActions: [
      { action: 'Product Views', count: 45000 },
      { action: 'Add to Cart', count: 12000 },
      { action: 'Checkout Started', count: 8500 },
      { action: 'Purchase Completed', count: 5200 },
      { action: 'Account Creation', count: 2800 },
      { action: 'Wishlist Adds', count: 9500 },
    ]
  };
};

const userData = generateUserData();
const demographicData = generateDemographicData();
const acquisitionData = generateAcquisitionData();
const engagementData = generateEngagementData();

const UserAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');
  const [selectedMetric, setSelectedMetric] = useState<'newUsers' | 'activeUsers' | 'returningUsers' | 'churnRate'>('activeUsers');
  
  // Filter data based on selected time range
  const filteredData = (() => {
    switch (timeRange) {
      case '3m':
        return userData.slice(-3);
      case '6m':
        return userData.slice(-6);
      case '12m':
        return userData;
      default:
        return userData.slice(-6);
    }
  })();
  
  // Metric labels and formatting
  const metricConfig = {
    newUsers: {
      label: 'New Users',
      format: (value: number) => value.toLocaleString(),
      color: 'rgba(14, 165, 233, 1)',
      bgColor: 'rgba(14, 165, 233, 0.2)',
    },
    activeUsers: {
      label: 'Active Users',
      format: (value: number) => value.toLocaleString(),
      color: 'rgba(139, 92, 246, 1)',
      bgColor: 'rgba(139, 92, 246, 0.2)',
    },
    returningUsers: {
      label: 'Returning Users',
      format: (value: number) => value.toLocaleString(),
      color: 'rgba(245, 158, 11, 1)',
      bgColor: 'rgba(245, 158, 11, 0.2)',
    },
    churnRate: {
      label: 'Churn Rate',
      format: (value: number) => `${value.toFixed(1)}%`,
      color: 'rgba(239, 68, 68, 1)',
      bgColor: 'rgba(239, 68, 68, 0.2)',
    },
  };
  
  // Calculate period-over-period change
  const calculateChange = () => {
    const currentPeriodData = [...filteredData];
    let previousPeriodData: UserDataItem[] = [];
    
    switch (timeRange) {
      case '3m':
        previousPeriodData = userData.slice(-6, -3);
        break;
      case '6m':
        previousPeriodData = userData.slice(-12, -6);
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
  
  // Calculate totals
  const totals = {
    newUsers: filteredData.reduce((sum, item) => sum + item.newUsers, 0),
    activeUsers: filteredData.reduce((sum, item) => sum + item.activeUsers, 0) / filteredData.length,
    returningUsers: filteredData.reduce((sum, item) => sum + item.returningUsers, 0),
    sessionDuration: filteredData.reduce((sum, item) => sum + item.sessionDuration, 0) / filteredData.length,
    pagesPerSession: filteredData.reduce((sum, item) => sum + item.pagesPerSession, 0) / filteredData.length,
    churnRate: filteredData.reduce((sum, item) => sum + item.churnRate, 0) / filteredData.length,
  };
  
  // Calculate conversion funnel
  const conversionFunnel = engagementData.userActions.map(action => action.count);
  const conversionRates = [];
  for (let i = 1; i < conversionFunnel.length; i++) {
    conversionRates.push(((conversionFunnel[i] / conversionFunnel[i-1]) * 100).toFixed(1));
  }
  
  return (
    <DashboardLayout 
      userRole="admin" 
      userName="Admin User" 
      userAvatar="/images/admin-avatar.jpg"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">User Analytics</h1>
        <p className="text-gray-600">
          Detailed insights about user behavior, demographics, and engagement
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
            <option value="activeUsers">Active Users</option>
            <option value="newUsers">New Users</option>
            <option value="returningUsers">Returning Users</option>
            <option value="churnRate">Churn Rate</option>
          </select>
          
          <button className="btn-outline py-1 px-3 text-sm">
            <DownloadIcon className="w-4 h-4 mr-1 inline-block" />
            Export Data
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="New Users"
          value={totals.newUsers.toLocaleString()}
          icon={<UserPlusIcon className="w-6 h-6" />}
          change={selectedMetric === 'newUsers' ? periodChange : undefined}
          footer={`${Math.round(totals.newUsers / filteredData.length)} per month`}
          color="primary"
        />
        
        <StatCard
          title="Active Users"
          value={Math.round(totals.activeUsers).toLocaleString()}
          icon={<UsersIcon className="w-6 h-6" />}
          change={selectedMetric === 'activeUsers' ? periodChange : undefined}
          footer="Monthly average"
          color="secondary"
        />
        
        <StatCard
          title="Avg. Session Duration"
          value={`${Math.floor(totals.sessionDuration / 60)}m ${Math.round(totals.sessionDuration % 60)}s`}
          icon={<ClockIcon className="w-6 h-6" />}
          footer={`${totals.pagesPerSession.toFixed(1)} pages per session`}
          color="accent"
        />
        
        <StatCard
          title="Churn Rate"
          value={`${totals.churnRate.toFixed(1)}%`}
          icon={<TrendingDownIcon className="w-6 h-6" />}
          change={selectedMetric === 'churnRate' ? { ...periodChange, isPositive: !periodChange.isPositive } : undefined}
          footer="Monthly average"
          color="danger"
        />
      </div>
      
      {/* Main Metric Chart */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{metricConfig[selectedMetric].label} Trend</h3>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold mr-2">
                {metricConfig[selectedMetric].format(
                  selectedMetric === 'activeUsers' 
                    ? totals.activeUsers 
                    : selectedMetric === 'churnRate'
                      ? totals.churnRate
                      : filteredData.reduce((sum, item) => sum + item[selectedMetric], 0)
                )}
              </span>
              {periodChange.value !== '0' && (
                <span className={`flex items-center text-sm ${
                  (selectedMetric === 'churnRate' ? !periodChange.isPositive : periodChange.isPositive) 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {(selectedMetric === 'churnRate' ? !periodChange.isPositive : periodChange.isPositive) ? (
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
          labels={filteredData.map(item => item.date)}
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
      
      {/* User Demographics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">User Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Age Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h4 className="text-base font-medium mb-4">Age Distribution</h4>
            <DoughnutChart
              title=""
              labels={demographicData.age.labels}
              data={demographicData.age.data}
              height={220}
            />
          </div>
          
          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h4 className="text-base font-medium mb-4">Gender Distribution</h4>
            <DoughnutChart
              title=""
              labels={demographicData.gender.labels}
              data={demographicData.gender.data}
              height={220}
            />
          </div>
          
          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h4 className="text-base font-medium mb-4">Geographic Distribution</h4>
            <DoughnutChart
              title=""
              labels={demographicData.location.labels}
              data={demographicData.location.data}
              height={220}
            />
          </div>
          
          {/* Device Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h4 className="text-base font-medium mb-4">Device Usage</h4>
            <DoughnutChart
              title=""
              labels={demographicData.devices.labels}
              data={demographicData.devices.data}
              height={220}
            />
          </div>
        </div>
      </div>
      
      {/* User Acquisition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Acquisition Channels</h3>
          <BarChart
            title=""
            labels={acquisitionData.channels.labels}
            datasets={[
              {
                label: 'Users (%)',
                data: acquisitionData.channels.data,
                backgroundColor: 'rgba(14, 165, 233, 0.7)',
              },
            ]}
            height={300}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Social Media Breakdown</h3>
          <DoughnutChart
            title=""
            labels={acquisitionData.socialPlatforms.labels}
            data={acquisitionData.socialPlatforms.data}
            height={300}
          />
        </div>
      </div>
      
      {/* User Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most Visited Pages */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Most Visited Pages</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {engagementData.mostVisitedPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page.page}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {page.visits.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {page.avgTime}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {engagementData.userActions.map((action, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{action.action}</span>
                  <span className="text-sm text-gray-600">{action.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full" 
                    style={{ 
                      width: `${(action.count / engagementData.userActions[0].count) * 100}%` 
                    }}
                  ></div>
                </div>
                {index > 0 && (
                  <div className="absolute right-0 -top-6 text-xs text-gray-500">
                    {conversionRates[index-1]}% from previous
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Cohort Analysis */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">User Retention by Cohort</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cohort
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 1
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 2
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 3
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 4
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 8
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(6)].map((_, index) => {
                const month = subMonths(new Date(), index);
                const initialUsers = Math.floor(Math.random() * 500) + 300;
                const retentionRates = [100];
                
                for (let i = 0; i < 5; i++) {
                  const prevRate = retentionRates[i];
                  const drop = Math.random() * 15 + 10;
                  retentionRates.push(Math.max(prevRate - drop, 0));
                }
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {format(month, 'MMM yyyy')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                      {initialUsers}
                    </td>
                    {retentionRates.slice(1).map((rate, i) => (
                      <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rate > 60 ? 'bg-green-100 text-green-800' :
                          rate > 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rate.toFixed(1)}%
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserAnalyticsPage;

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

const UsersIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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

const ClockIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TrendingDownIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
); 