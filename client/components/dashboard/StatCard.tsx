'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  footer?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  footer,
  color = 'primary' 
}: StatCardProps) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      icon: 'text-primary-500',
    },
    secondary: {
      bg: 'bg-secondary-50',
      text: 'text-secondary-600',
      icon: 'text-secondary-500',
    },
    accent: {
      bg: 'bg-accent-50',
      text: 'text-accent-600',
      icon: 'text-accent-500',
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-500',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      icon: 'text-amber-500',
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      icon: 'text-red-500',
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].bg}`}>
          <div className={colorClasses[color].icon}>
            {icon}
          </div>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center mb-2">
          {change.isPositive ? (
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
            {change.value}%
          </span>
          <span className="text-gray-500 text-sm ml-1">from previous period</span>
        </div>
      )}
      
      {footer && (
        <div className="text-sm text-gray-500 mt-2">
          {footer}
        </div>
      )}
    </div>
  );
};

export default StatCard;

// Icon components
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