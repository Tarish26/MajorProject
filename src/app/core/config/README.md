# Dashboard Configuration Guide

The dashboard is now fully config-driven! You can customize all cards by simply updating the configuration, including styling, layout, and data.

## Styling Features

Each card supports comprehensive styling customization. You can control:
- **Container**: Background color/gradient, border, padding, margin, shadows, dimensions
- **Typography**: Font sizes, weights, colors for titles, values, and labels
- **Custom CSS**: Advanced styling with custom CSS properties

## Configuration File

The main configuration is located at: `src/app/core/config/dashboard.config.ts`

## How It Works

### 1. Adding New Metric Cards

Simply add a new metric card to the `cards` array:

```typescript
{
  id: 'metric-custom-name',
  type: 'metric',
  order: 5, // Controls display order
  gridColumn: 'span 1', // Optional: spans 1 column (default)
  visible: true, // Optional: hide/show card
  data: {
    id: 'custom-id',
    title: 'Custom Metric',
    value: 1234,
    change: 5.2,
    changeType: 'increase',
    icon: 'star',
    color: '#ff6b6b'
  },
  styles: {
    // Container styles
    backgroundColor: '#ffffff',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    
    // Typography - Title
    titleFontSize: '0.875rem',
    titleFontColor: '#6b7280',
    titleFontWeight: '500',
    
    // Typography - Value
    valueFontSize: '1.875rem',
    valueFontColor: '#1f2937',
    valueFontWeight: '700'
  }
}
```

### 2. Adding Chart Cards

```typescript
{
  id: 'chart-custom-chart',
  type: 'chart',
  order: 6,
  title: 'Custom Chart Title',
  gridColumn: 'span 4', // Full width
  chartData: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Sales',
        data: [100, 200, 150, 250],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  },
  styles: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    titleFontSize: '1.125rem',
    titleFontWeight: '600',
    titleFontColor: '#1f2937',
    minHeight: '350px'
  }
}
```

### 3. Adding Table Cards

```typescript
{
  id: 'table-custom-table',
  type: 'table',
  order: 7,
  title: 'Custom Table',
  gridColumn: 'span 4',
  data: [
    {
      id: '1',
      type: 'event',
      description: 'Custom event description',
      timestamp: new Date(),
      user: 'User Name',
      status: 'info'
    }
  ],
  styles: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    titleFontSize: '1.125rem',
    titleFontWeight: '600',
    titleFontColor: '#1f2937',
    labelFontSize: '0.875rem',
    labelFontColor: '#6b7280'
  }
}
```

## Dynamic Configuration

You can also update the configuration programmatically:

```typescript
// In your component
constructor(private dashboardService: DashboardService) {}

// Add a new card
addNewCard() {
  this.dashboardService.addCard({
    id: 'new-card',
    type: 'metric',
    order: 10,
    data: { /* metric data */ }
  });
}

// Update existing card
updateCard() {
  this.dashboardService.updateCard('metric-total-users', {
    visible: false
  });
}

// Toggle card visibility
toggleCard() {
  this.dashboardService.toggleCardVisibility('metric-total-users');
}

// Remove a card
removeCard() {
  this.dashboardService.removeCard('metric-total-users');
}
```

## Layout Configuration

Control the overall layout:

```typescript
{
  layout: {
    gridColumns: 4, // Number of columns in the grid
    gap: '1.5rem'   // Gap between cards
  }
}
```

## Card Properties

All cards support these base properties:
- `id`: Unique identifier
- `type`: Card type ('metric', 'chart', 'table')
- `order`: Display order (lower numbers appear first)
- `visible`: Show/hide card (default: true)
- `gridColumn`: CSS grid column span (e.g., 'span 2', 'span 4')

## Examples

### Hide a card
```typescript
{
  id: 'metric-total-users',
  type: 'metric',
  visible: false, // Card won't be displayed
  // ... rest of config
}
```

### Make a card span multiple columns
```typescript
{
  id: 'chart-sales-revenue',
  type: 'chart',
  gridColumn: 'span 2', // Spans 2 columns
  // ... rest of config
}
```

### Reorder cards
```typescript
// Lower order numbers appear first
{ id: 'card-1', type: 'metric', order: 1 }  // First
{ id: 'card-2', type: 'metric', order: 2 }  // Second
{ id: 'card-3', type: 'metric', order: 3 }  // Third
```

## Styling Properties

### Container Styles
- `backgroundColor`: Card background color (e.g., `'#ffffff'`)
- `backgroundGradient`: Linear gradient (e.g., `'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'`)
- `borderColor`: Border color
- `borderWidth`: Border width (e.g., `'2px'`)
- `borderRadius`: Border radius (e.g., `'0.75rem'`)
- `padding`: Padding (e.g., `'1.5rem'`)
- `margin`: Margin (e.g., `'1rem'`)
- `boxShadow`: Box shadow (e.g., `'0 4px 6px -1px rgba(0, 0, 0, 0.1)'`)
- `minHeight`: Minimum height
- `maxHeight`: Maximum height
- `width`: Card width

### Typography - Global
- `fontFamily`: Font family (e.g., `'Inter, sans-serif'`)
- `fontColor`: Global text color

### Typography - Title
- `titleFontSize`: Title font size (e.g., `'1.125rem'`)
- `titleFontWeight`: Title font weight (e.g., `'600'`)
- `titleFontColor`: Title font color
- `titleLineHeight`: Title line height
- `titleMargin`: Title margin

### Typography - Value/Content
- `valueFontSize`: Value font size (e.g., `'1.875rem'`)
- `valueFontWeight`: Value font weight (e.g., `'700'`)
- `valueFontColor`: Value font color
- `valueLineHeight`: Value line height

### Typography - Label/Secondary Text
- `labelFontSize`: Label font size
- `labelFontWeight`: Label font weight
- `labelFontColor`: Label font color

### Custom CSS
For advanced styling, use the `customCSS` property:

```typescript
styles: {
  customCSS: {
    'transform': 'rotate(5deg)',
    'opacity': '0.9',
    'backdrop-filter': 'blur(10px)'
  }
}
```

## Styling Examples

### Example 1: Gradient Background Card
```typescript
{
  id: 'metric-premium',
  type: 'metric',
  styles: {
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '1rem',
    padding: '2rem',
    titleFontColor: 'rgba(255, 255, 255, 0.9)',
    valueFontColor: '#ffffff',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
  }
}
```

### Example 2: Custom Border Card
```typescript
{
  id: 'metric-bordered',
  type: 'metric',
  styles: {
    backgroundColor: '#ffffff',
    borderColor: '#3b82f6',
    borderWidth: '3px',
    borderRadius: '0.5rem',
    padding: '1.5rem'
  }
}
```

### Example 3: Large Font Card
```typescript
{
  id: 'metric-large',
  type: 'metric',
  styles: {
    valueFontSize: '3rem',
    valueFontWeight: '800',
    valueFontColor: '#1f2937',
    titleFontSize: '1.25rem',
    titleFontWeight: '600'
  }
}
```
