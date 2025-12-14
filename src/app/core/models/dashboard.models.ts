export interface Metric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

// Configuration-driven card types
export type CardType = 'metric' | 'chart' | 'table' | 'custom';

/**
 * Styling configuration for cards
 * Supports most common CSS properties
 */
export interface CardStyles {
  // Container styles
  backgroundColor?: string;
  backgroundGradient?: string; // Linear gradient string (e.g., 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  boxShadow?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;

  // Typography - Global
  fontFamily?: string;
  fontColor?: string; // Global text color

  // Typography - Title
  titleFontSize?: string;
  titleFontWeight?: string;
  titleFontColor?: string;
  titleLineHeight?: string;
  titleMargin?: string;

  // Typography - Value/Content
  valueFontSize?: string;
  valueFontWeight?: string;
  valueFontColor?: string;
  valueLineHeight?: string;

  // Typography - Label/Secondary text
  labelFontSize?: string;
  labelFontWeight?: string;
  labelFontColor?: string;

  // Custom CSS (for advanced styling)
  customCSS?: Record<string, string>;
}

export interface BaseCardConfig {
  id: string;
  type: CardType;
  title?: string;
  visible?: boolean;
  order?: number;
  gridColumn?: string; // CSS grid column span (e.g., 'span 2')
  styles?: CardStyles; // Custom styling for the card
}

export interface MetricCardConfig extends BaseCardConfig {
  type: 'metric';
  data: Metric;
}

export interface ChartCardConfig extends BaseCardConfig {
  type: 'chart';
  title: string;
  chartData: ChartData;
  chartType?: 'line' | 'bar' | 'pie';
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  height?: number;
}

export interface TableCardConfig extends BaseCardConfig {
  type: 'table';
  title: string;
  data: Activity[];
  columns?: string[];
}

export type CardConfig = MetricCardConfig | ChartCardConfig | TableCardConfig;

export interface DashboardConfig {
  title: string;
  description?: string;
  cards: CardConfig[];
  layout?: {
    gridColumns?: number;
    gap?: string;
  };
}