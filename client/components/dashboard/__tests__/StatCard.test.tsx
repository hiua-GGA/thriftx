import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard Component', () => {
  const mockIcon = <span data-testid="mock-icon">Icon</span>;

  test('renders with required props', () => {
    render(
      <StatCard 
        title="Total Sales" 
        value="$10,000" 
        icon={mockIcon} 
      />
    );
    
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('renders with positive change', () => {
    render(
      <StatCard 
        title="Total Sales" 
        value="$10,000" 
        icon={mockIcon}
        change={{ value: 15, isPositive: true }}
      />
    );
    
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('from previous period')).toBeInTheDocument();
    // Check if the ArrowUpIcon is rendered
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.querySelector('polyline[points="5 12 12 5 19 12"]')).toBeInTheDocument();
  });

  test('renders with negative change', () => {
    render(
      <StatCard 
        title="Total Sales" 
        value="$10,000" 
        icon={mockIcon}
        change={{ value: 8, isPositive: false }}
      />
    );
    
    expect(screen.getByText('8%')).toBeInTheDocument();
    // Check if the ArrowDownIcon is rendered
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.querySelector('polyline[points="19 12 12 19 5 12"]')).toBeInTheDocument();
  });

  test('renders with footer text', () => {
    render(
      <StatCard 
        title="Total Sales" 
        value="$10,000" 
        icon={mockIcon}
        footer="Last updated: Today"
      />
    );
    
    expect(screen.getByText('Last updated: Today')).toBeInTheDocument();
  });

  test('renders with different color variants', () => {
    const { rerender } = render(
      <StatCard 
        title="Total Sales" 
        value="$10,000" 
        icon={mockIcon}
        color="success"
      />
    );
    
    // Check for success color class
    expect(document.querySelector('.bg-green-50')).toBeInTheDocument();
    
    rerender(
      <StatCard 
        title="Total Sales" 
        value="$10,000" 
        icon={mockIcon}
        color="danger"
      />
    );
    
    // Check for danger color class
    expect(document.querySelector('.bg-red-50')).toBeInTheDocument();
  });
}); 