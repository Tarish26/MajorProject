import { Component, Input, OnInit, signal, OnChanges, SimpleChanges, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, CardStyles } from '../../../core/models/dashboard.models';
import { getCardStyles, getTitleStyles } from '../../../core/utils/style-utils';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss'
})
export class ChartCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) chartData!: ChartData;
  @Input() chartType: 'line' | 'bar' | 'pie' = 'line';

  private _styles = signal<CardStyles | undefined>(undefined);
  @Input()
  set styles(value: CardStyles | undefined) {
    this._styles.set(value);
    // Redraw chart if styles change (e.g. colors)
    this.drawChart();
  }

  readonly canvasId = signal(`chart-${Math.random().toString(36).substr(2, 9)}`);
  readonly cardStyles = computed(() => getCardStyles(this._styles()));
  readonly titleStyles = computed(() => getTitleStyles(this._styles()));
  private chartInstance: any = null;

  ngOnInit(): void {
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.drawChart();
    }
  }

  private drawChart(): void {
    setTimeout(() => {
      const canvas = document.getElementById(this.canvasId()) as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear previous chart
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple line chart implementation
      const width = canvas.width;
      const height = canvas.height;
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      const labels = this.chartData.labels;
      const maxValue = Math.max(...this.chartData.datasets.flatMap(d => d.data));

      // Draw grid lines and Y-axis labels
      ctx.strokeStyle = '#e5e7eb';
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 1;

      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        const value = Math.round(maxValue - (maxValue / 5) * i);

        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        // Draw Y-axis label
        ctx.fillText(value.toString(), padding - 10, y);
      }

      // Draw datasets
      this.chartData.datasets.forEach((dataset, index) => {
        ctx.strokeStyle = dataset.borderColor || '#3b82f6';
        ctx.fillStyle = dataset.backgroundColor || 'rgba(59, 130, 246, 0.1)';
        ctx.lineWidth = 2;

        const chartType = this.chartType || 'line';

        if (chartType === 'bar') {
          const barWidth = (chartWidth / labels.length) * 0.6;
          dataset.data.forEach((value, i) => {
            const x = padding + (chartWidth / labels.length) * i + (chartWidth / labels.length - barWidth) / 2;
            const barHeight = (value / maxValue) * chartHeight;
            const y = padding + chartHeight - barHeight;

            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.strokeRect(x, y, barWidth, barHeight);
          });
        } else {
          // Line Chart (Default)
          ctx.beginPath();
          dataset.data.forEach((value, i) => {
            const x = padding + (chartWidth / (labels.length - 1)) * i;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();

          // Fill area
          ctx.lineTo(width - padding, height - padding);
          ctx.lineTo(padding, height - padding);
          ctx.closePath();
          ctx.fill();

          // Draw points
          ctx.fillStyle = dataset.borderColor || '#3b82f6';
          dataset.data.forEach((value, i) => {
            const x = padding + (chartWidth / (labels.length - 1)) * i;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });

      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      labels.forEach((label, i) => {
        const x = padding + (chartWidth / (labels.length - 1)) * i;
        // Adjust x for bar chart centering if needed, but simple line logic usually ok for labels
        // For bar chart, we might want to center on the bar interval
        let labelX = x;
        if (this.chartType === 'bar') {
          labelX = padding + (chartWidth / labels.length) * i + (chartWidth / labels.length) / 2;
        }

        ctx.fillText(label, labelX, height - padding + 20);
      });
    }, 100);
  }
}
