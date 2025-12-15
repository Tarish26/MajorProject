import { DashboardConfig } from '../models/dashboard.models';

export const productsConfig: DashboardConfig = {
    title: 'Product Inventory',
    description: 'Track stock levels, sales performance, and product trends.',
    layout: {
        gridColumns: 4,
        gap: '1.5rem'
    },
    cards: [
        {
            id: 'products-metric-total',
            type: 'metric',
            order: 1,
            data: {
                id: 'p1',
                title: 'Total Items',
                value: '1,234',
                change: 0,
                changeType: 'neutral',
                icon: 'inventory',
                color: '#6366f1'
            }
        },
        {
            id: 'products-metric-low',
            type: 'metric',
            order: 2,
            data: {
                id: 'p2',
                title: 'Low Stock',
                value: '12',
                change: 2,
                changeType: 'decrease', // increased low stock is bad, usually red/warning
                icon: 'warning',
                color: '#ef4444'
            }
        },
        {
            id: 'products-chart-categories',
            type: 'chart',
            order: 3,
            title: 'Inventory by Category',
            gridColumn: 'span 2',
            chartData: {
                labels: ['Electronics', 'Clothing', 'Home', 'Books'],
                datasets: [
                    {
                        label: 'Items',
                        data: [420, 300, 250, 180],
                        backgroundColor: 'rgba(239, 68, 68, 0.6)', // Reddish
                        borderColor: 'rgba(239, 68, 68, 1)'
                    }
                ]
            },
            chartType: 'pie'
        },
        {
            id: 'products-table-top',
            type: 'table',
            order: 4,
            title: 'Top Selling Products',
            gridColumn: 'span 4',
            data: [
                { id: '1', type: 'product', description: 'Wireless Headphones - 120 sold', timestamp: new Date(), user: 'Review', status: 'success' },
                { id: '2', type: 'product', description: 'Smart Watch - 85 sold', timestamp: new Date(), user: 'Review', status: 'success' },
                { id: '3', type: 'product', description: 'Running Shoes - 70 sold', timestamp: new Date(), user: 'Review', status: 'info' },
                { id: '4', type: 'product', description: 'Laptop Stand - 55 sold', timestamp: new Date(), user: 'Review', status: 'info' }
            ]
        }
    ]
};
