import React from 'react';
import { render } from '@testing-library/react';
import LineChart from '../LineChart';

// Mock the react-chartjs-2 Line component
jest.mock('react-chartjs-2', () => ({
  Line: jest.fn(() => <div data-testid="mocked-line-chart" />),
}));

describe('LineChart Component', () => {
  const mockProps = {
    title: 'Monthly Sales',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sales 2023',
        data: [30, 45, 60, 55, 70],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Sales 2022',
        data: [25, 40, 50, 45, 60],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
      },
    ],
  };

  test('renders the LineChart component', () => {
    const { getByTestId } = render(<LineChart {...mockProps} />);
    expect(getByTestId('mocked-line-chart')).toBeInTheDocument();
  });

  test('renders with custom height', () => {
    const { container } = render(<LineChart {...mockProps} height={500} />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer).toHaveStyle('height: 500px');
  });

  test('passes correct data to Line component', () => {
    render(<LineChart {...mockProps} />);
    
    // Get the most recent call to the Line component
    const { Line } = require('react-chartjs-2');
    const mostRecentCall = Line.mock.calls[Line.mock.calls.length - 1];
    const [props] = mostRecentCall;
    
    // Check data
    expect(props.data.labels).toEqual(mockProps.labels);
    expect(props.data.datasets[0].label).toBe('Sales 2023');
    expect(props.data.datasets[1].label).toBe('Sales 2022');
    
    // Check options
    expect(props.options.plugins.title.text).toBe('Monthly Sales');
    expect(props.options.responsive).toBe(true);
    expect(props.options.maintainAspectRatio).toBe(false);
  });

  test('applies default height when not specified', () => {
    const { container } = render(<LineChart {...mockProps} />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer).toHaveStyle('height: 300px');
  });
}); 