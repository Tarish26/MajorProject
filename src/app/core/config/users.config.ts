import { DashboardConfig } from '../models/dashboard.models';

export const usersConfig: DashboardConfig = {
    title: 'User Management',
    description: 'Manage and monitor user accounts and activities.',
    layout: {
        gridColumns: 4,
        gap: '1.5rem'
    },
    cards: [
        {
            id: 'users-metric-total',
            type: 'metric',
            order: 1,
            data: {
                id: 'u1',
                title: 'Total Users',
                value: '5,423',
                change: 124,
                changeType: 'increase',
                icon: 'group',
                color: '#3b82f6'
            }
        },
        {
            id: 'users-metric-active',
            type: 'metric',
            order: 2,
            data: {
                id: 'u2',
                title: 'Active Now',
                value: '342',
                change: 12,
                changeType: 'increase',
                icon: 'person_pin',
                color: '#10b981'
            }
        },
        {
            id: 'users-chart-registrations',
            type: 'chart',
            order: 3,
            title: 'New Registrations',
            gridColumn: 'span 2',
            chartData: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'New Users',
                        data: [45, 52, 38, 65, 48, 25, 30],
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderColor: 'rgba(139, 92, 246, 1)'
                    }
                ]
            },
            chartType: 'line'
        },
        {
            id: 'users-table-list',
            type: 'table',
            order: 4,
            title: 'Recent Users',
            gridColumn: 'span 4',
            data: [
                { id: '1', type: 'user', description: 'New account created', timestamp: new Date(), user: 'Alice Cooper', status: 'success' },
                { id: '2', type: 'user', description: 'Password reset', timestamp: new Date(Date.now() - 3600000), user: 'Bob Dylan', status: 'info' },
                { id: '3', type: 'user', description: 'Profile updated', timestamp: new Date(Date.now() - 7200000), user: 'Charlie Puth', status: 'info' },
                { id: '4', type: 'user', description: 'Failed login attempt', timestamp: new Date(Date.now() - 10800000), user: 'David Bowie', status: 'warning' }
            ]
        }
    ]
};
