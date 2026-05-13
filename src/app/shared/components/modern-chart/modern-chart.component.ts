
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../../core/models/dashboard.models';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-modern-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modern-chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
    styles: [`
    .modern-chart-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 300px;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class ModernChartComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input() data: ChartData | null = null;
    @Input() type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' = 'line';
    @Input() options: any = {};
    @Input() title: string = '';

    @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    private chartInstance: Chart | null = null;

    ngAfterViewInit(): void {
        if (this.data) {
            this.renderChart();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && !changes['data'].firstChange) {
            this.renderChart();
        }
        if (changes['type'] && !changes['type'].firstChange) {
            this.renderChart();
        }
        if (changes['options'] && !changes['options'].firstChange) {
            this.renderChart();
        }
    }

    ngOnDestroy(): void {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }

    private renderChart(): void {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        if (!this.data || !this.canvasRef) return;

        const ctx = this.canvasRef.nativeElement.getContext('2d');
        if (!ctx) return;

        // ... existing gradient logic ...
        const datasets = this.data.datasets.map(d => {
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            const color = d.borderColor || 'rgba(59, 130, 246, 1)';

            let startColor = color;
            let endColor = color.replace(/[\d\.]+\)$/, '0)');

            if (!startColor.startsWith('rgba')) {
                startColor = 'rgba(59, 130, 246, 0.5)';
                endColor = 'rgba(59, 130, 246, 0)';
            } else {
                startColor = color.replace(/[\d\.]+\)$/, '0.5)');
            }

            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);

            return {
                ...d,
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: d.borderColor,
                pointHoverBackgroundColor: d.borderColor,
                pointHoverBorderColor: '#fff',
                fill: true
            };
        });

        // Merge default options with input options
        const defaultOptions: any = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                title: {
                    display: !!this.title,
                    text: this.title
                },
                tooltip: {
                    // ... existing tooltip ...
                }
            },
            // ... scales ...
        };

        // Deep merge or simple spread for now. For Chart.js, usually Object.assign is mostly enough for top level, 
        // but let's just use the input options to override specific keys if provided.
        // Actually, let's keep it simple: defaults first, then overrides.

        const mergedOptions = {
            ...defaultOptions,
            ...this.options,
            plugins: { ...defaultOptions.plugins, ...this.options?.plugins },
            scales: { ...defaultOptions.scales, ...this.options?.scales }
        };

        const config: ChartConfiguration = {
            type: this.type as any,
            data: {
                labels: this.data.labels,
                datasets: datasets
            },
            options: mergedOptions
        };

        this.chartInstance = new Chart(ctx, config);
    }
}
