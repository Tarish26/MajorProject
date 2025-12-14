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
      id: 'metric-conversion-rate',
      type: 'metric',
      order: 4,
      data: {
        id: '4',
        title: 'Conversion Rate',
        value: '2.4%',
        change: 0.5,
        changeType: 'increase',
        icon: 'trending_up',
        color: '#8b5cf6'
      }
    },
    // Chart Card
    {
      id: 'chart-sales-revenue',
      type: 'chart',
      order: 5,
      title: 'Sales & Revenue',
      gridColumn: 'span 4',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [65, 78, 90, 81, 95, 105],
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)'
          },
          {
            label: 'Revenue',
            data: [45, 62, 75, 68, 82, 92],
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 1)'
          }
        ]
      },
     
    },
    // Table Card
    {
      id: 'table-recent-activity',
      type: 'table',
      order: 6,
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
