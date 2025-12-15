import { DashboardConfig, ChartData } from '../models/dashboard.models';

export const defaultDashboardConfig: DashboardConfig = {
  title: 'Dashboard Overview',
  description: 'Welcome back! Here\'s what\'s happening with your business today.',
  layout: {
    gridColumns: 4,
    gap: '1.5rem'
  },
  cards: [
    // Metric Cards
    {
      id: 'metric-total-users',
      type: 'metric',
      order: 1,
      data: {
        id: '1',
        title: 'Total Users',
        value: 1248,
        change: 12.5,
        changeType: 'increase',
        icon: 'people',
        color: '#3b82f6'
      },

    },
    {
      id: 'metric-revenue',
      type: 'metric',
      order: 2,
      data: {
        id: '2',
        title: 'Revenue',
        value: '$45,231',
        change: 8.2,
        changeType: 'increase',
        icon: 'attach_money',
        color: '#10b981'
      },

    },
    {
      id: 'metric-orders',
      type: 'metric',
      order: 3,
      data: {
        id: '3',
        title: 'Orders',
        value: 342,
        change: -3.1,
        changeType: 'decrease',
        icon: 'shopping_cart',
        color: '#f59e0b'
      },

    },
    {
      id: 'metric-products',
      type: 'metric',
      order: 4,
      data: {
        id: '4',
        title: 'Total Products',
        value: '1,240',
        change: 15.3,
        changeType: 'increase',
        icon: 'inventory_2',
        color: '#8b5cf6'
      }
    },
    // Chart Card
    {
      id: 'chart-sales-revenue',
      type: 'chart',
      order: 5,
      title: 'Revenue Analytics',
      gridColumn: 'span 2',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [45, 62, 75, 68, 82, 92],
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 1)'
          }
        ]
      },
      chartType: 'line'
    },
    {
      id: 'chart-user-growth',
      type: 'chart',
      order: 6,
      title: 'User Growth',
      gridColumn: 'span 2',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Active Users',
            data: [1000, 1050, 1120, 1180, 1200, 1248],
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)'
          }
        ]
      },
      chartType: 'line'
    },
    {
      id: 'chart-product-performance',
      type: 'chart',
      order: 7,
      title: 'Top Product Sales',
      gridColumn: 'span 4',
      chartData: {
        labels: ['Electronics', 'Clothing', 'Home', 'Books', 'Sports'],
        datasets: [
          {
            label: 'Sales',
            data: [350, 420, 210, 150, 180],
            backgroundColor: 'rgba(245, 158, 11, 0.6)',
            borderColor: 'rgba(245, 158, 11, 1)'
          }
        ]
      },
      chartType: 'bar'
    },
    // Table Card
    {
      id: 'table-recent-activity',
      type: 'table',
      order: 8,
      title: 'Recent Activity',
      gridColumn: 'span 4',

      data: [
        {
          id: '1',
          type: 'order',
          description: 'New order #1234 placed',
          timestamp: new Date(Date.now() - 5 * 60000),
          user: 'John Doe',
          status: 'success'
        },
        {
          id: '2',
          type: 'user',
          description: 'New user registration',
          timestamp: new Date(Date.now() - 15 * 60000),
          user: 'Jane Smith',
          status: 'info'
        },
        {
          id: '3',
          type: 'payment',
          description: 'Payment failed for order #1230',
          timestamp: new Date(Date.now() - 30 * 60000),
          user: 'Bob Johnson',
          status: 'error'
        },
        {
          id: '4',
          type: 'update',
          description: 'Product inventory updated',
          timestamp: new Date(Date.now() - 45 * 60000),
          user: 'Admin',
          status: 'warning'
        },
        {
          id: '5',
          type: 'order',
          description: 'Order #1233 shipped',
          timestamp: new Date(Date.now() - 60 * 60000),
          user: 'John Doe',
          status: 'success'
        }
      ]
    }
  ]
};
