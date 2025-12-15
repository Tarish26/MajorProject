import { DashboardConfig } from '../models/dashboard.models';

export const analyticsConfig: DashboardConfig = {
    title: 'Analytics Overview',
    description: 'Deep dive into your business performance metrics.',
    layout: {
        gridColumns: 4,
        gap: '1.5rem'
    },
    cards: [
        {
            id: 'analytics-metric-views',
            type: 'metric',
            order: 1,
            data: {
                id: '1',
                title: 'Page Views',
                value: '1.2M',
                change: 8.5,
                changeType: 'increase',
                icon: 'visibility',
                color: '#3b82f6'
            }
        },
        {
            id: 'analytics-metric-sessions',
            type: 'metric',
            order: 2,
            data: {
                id: '2',
                title: 'Avg. Session',
                value: '4m 32s',
                change: 2.1,
                changeType: 'increase',
                icon: 'timer',
                color: '#10b981'
            }
        },
        {
            id: 'analytics-metric-bounce',
            type: 'metric',
            order: 3,
            data: {
                id: '3',
                title: 'Bounce Rate',
                value: '42.3%',
                change: -1.2,
                changeType: 'decrease', // Good thing
                icon: 'exit_to_app',
                color: '#f59e0b'
            }
        },
        {
            id: 'analytics-metric-conversion',
            type: 'metric',
            order: 4,
            data: {
                id: '4',
                title: 'Conversion Rate',
                value: '3.2%',
                change: 0.4,
                changeType: 'increase',
                icon: 'trending_up',
                color: '#8b5cf6'
            }
        },
        {
            id: 'analytics-chart-traffic',
            type: 'chart',
            order: 5,
            title: 'Traffic Sources',
            gridColumn: 'span 2',
            chartData: {
                labels: ['Organic Search', 'Direct', 'Social', 'Referral', 'Email'],
                datasets: [
                    {
                        label: 'Visitors',
                        data: [4500, 3200, 2100, 1500, 900],
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)'
                    }
                ]
            },
            chartType: 'bar'
        },
        {
            id: 'analytics-chart-trends',
            type: 'chart',
            order: 6,
            title: 'Monthly Trends',
            gridColumn: 'span 2',
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Visits',
                        data: [12000, 13500, 12800, 14200, 15100, 16500],
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderColor: 'rgba(16, 185, 129, 1)'
                    }
                ]
            },
            chartType: 'line'
        }
    ]
};
