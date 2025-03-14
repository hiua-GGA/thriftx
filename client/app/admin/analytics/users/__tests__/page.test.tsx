import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserAnalyticsPage from '../page';

// Mock the components used in the page
jest.mock('@/components/dashboard/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dashboard-layout">{children}</div>
  ),
}));

jest.mock('@/components/dashboard/charts/LineChart', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="mock-line-chart">{title}</div>
  ),
}));

jest.mock('@/components/dashboard/charts/BarChart', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="mock-bar-chart">{title}</div>
  ),
}));

jest.mock('@/components/dashboard/charts/DoughnutChart', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="mock-doughnut-chart">{title}</div>
  ),
}));

jest.mock('@/components/dashboard/StatCard', () => ({
  __esModule: true,
  default: ({ title, value }: { title: string; value: string | number }) => (
    <div data-testid="mock-stat-card">
      {title}: {value}
    </div>
  ),
}));

// Mock date-fns functions
jest.mock('date-fns', () => ({
  format: jest.fn(() => 'Jan 2023'),
  subDays: jest.fn((date) => date),
  subMonths: jest.fn((date) => date),
  startOfMonth: jest.fn((date) => date),
  endOfMonth: jest.fn((date) => date),
}));

describe('User Analytics Page', () => {
  test('renders the page with dashboard layout', () => {
    render(<UserAnalyticsPage />);
    expect(screen.getByTestId('mock-dashboard-layout')).toBeInTheDocument();
  });

  test('renders stat cards with user metrics', () => {
    render(<UserAnalyticsPage />);
    const statCards = screen.getAllByTestId('mock-stat-card');
    expect(statCards.length).toBeGreaterThan(0);
    
    // Check for specific stat cards
    expect(screen.getByText(/New Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Returning Users/i)).toBeInTheDocument();
  });

  test('renders charts for user data visualization', () => {
    render(<UserAnalyticsPage />);
    
    // Check for line charts
    const lineCharts = screen.getAllByTestId('mock-line-chart');
    expect(lineCharts.length).toBeGreaterThan(0);
    expect(screen.getByText(/User Growth/i)).toBeInTheDocument();
    
    // Check for bar charts
    const barCharts = screen.getAllByTestId('mock-bar-chart');
    expect(barCharts.length).toBeGreaterThan(0);
    
    // Check for doughnut charts
    const doughnutCharts = screen.getAllByTestId('mock-doughnut-chart');
    expect(doughnutCharts.length).toBeGreaterThan(0);
  });

  test('allows changing the time period', () => {
    render(<UserAnalyticsPage />);
    
    // Find and click the time period selector
    const timePeriodSelector = screen.getByRole('combobox');
    expect(timePeriodSelector).toBeInTheDocument();
    
    fireEvent.change(timePeriodSelector, { target: { value: '30' } });
    
    // After changing time period, charts should be re-rendered
    expect(screen.getAllByTestId('mock-line-chart').length).toBeGreaterThan(0);
  });
}); 