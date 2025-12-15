import { DashboardConfig } from '../models/dashboard.models';

export const ordersConfig: DashboardConfig = {
    title: 'Orders Management',
    description: 'Monitor order status, fulfillment, and revenue.',
    layout: {
        gridColumns: 4,
        gap: '1.5rem'
    },
    cards: [
        {
            id: 'orders-metric-pending',
            type: 'metric',
            order: 1,
            data: {
                id: 'o1',
                title: 'Pending Orders',
                value: 24,
                change: 5,
                changeType: 'increase',
                icon: 'hourglass_empty',
                color: '#f59e0b'
            }
        },
        {
            id: 'orders-metric-completed',
            type: 'metric',
            order: 2,
            data: {
                id: 'o2',
                title: 'Completed',
                value: 156,
                change: 12.3,
                changeType: 'increase',
                icon: 'check_circle',
                color: '#10b981'
            }
        },
        {
            id: 'orders-metric-returns',
            type: 'metric',
            order: 3,
            data: {
                id: 'o3',
                title: 'Returns',
                value: 3,
                change: -1,
                changeType: 'decrease',
                icon: 'assignment_return',
                color: '#ef4444'
            }
        },
        {
            id: 'orders-chart-volume-actual',
            type: 'chart',
            order: 4,
            title: 'Order Volume',
            gridColumn: 'span 4',
            chartData: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Orders',
                        data: [42, 56, 48, 62, 75, 55, 40],
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderColor: 'rgba(16, 185, 129, 1)'
                    }
                ]
            },
            chartType: 'bar'
        },
        {
            id: 'orders-table-recent',
            type: 'table',
            order: 5,
            title: 'Recent Orders',
            gridColumn: 'span 4',
            data: [
                { id: '1', type: 'order', description: 'Order #3452 - $120.50', timestamp: new Date(), user: 'John Doe', status: 'success' },
                { id: '2', type: 'order', description: 'Order #3451 - $45.00', timestamp: new Date(Date.now() - 1000000), user: 'Jane Smith', status: 'success' },
                { id: '3', type: 'order', description: 'Order #3450 - $220.00', timestamp: new Date(Date.now() - 2000000), user: 'Mike Ross', status: 'warning' },
                { id: '4', type: 'order', description: 'Order #3449 - $15.99', timestamp: new Date(Date.now() - 3000000), user: 'Rachel Green', status: 'error' }
            ]
        }
    ]
};
