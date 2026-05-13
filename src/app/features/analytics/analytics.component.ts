
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { ActivityTableComponent } from '../../shared/components/activity-table/activity-table.component';
import { ModernChartComponent } from '../../shared/components/modern-chart/modern-chart.component';
import { CsvParserService } from '../../core/services/csv-parser.service';
import { AnalyticsStateService } from '../../core/services/analytics-state.service';
import {
    CardConfig,
    DashboardConfig,
    ChartData
} from '../../core/models/dashboard.models';

import { Router } from '@angular/router';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [
        CommonModule,
        MetricCardComponent,
        ChartCardComponent,
        ActivityTableComponent,
        ModernChartComponent
    ],
    templateUrl: './analytics.component.html',
    styleUrl: './analytics.component.scss',
})

export class AnalyticsComponent implements OnInit {
    private dashboardService = inject(DashboardService);
    private csvParser = inject(CsvParserService);
    private analyticsState = inject(AnalyticsStateService);
    private router = inject(Router);

    readonly cards$: Observable<CardConfig[]> = this.dashboardService.cards$;
    readonly config$: Observable<DashboardConfig | null> = this.dashboardService.config$;


    customChartData: ChartData | null = null;
    isProcessing = false;
    errorMessage = '';
    lastUpdated: number | null = null;
    fileName: string | null = null;
    dashboardUpdated = false;

    // Default chart type
    selectedChartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' = 'line';

    // Animation options - will apply to ModernChartComponent
    chartOptions = {
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    };

    ngOnInit() {
        this.dashboardService.getConfig('analytics').subscribe();
        this.loadSavedState();
    }

    private loadSavedState() {
        const state = this.analyticsState.getState();
        if (state) {
            this.customChartData = state.data;
            this.lastUpdated = state.timestamp;
            this.fileName = state.fileName || null;
            if (state.chartType) {
                this.selectedChartType = state.chartType;
            }
        }
    }

    async onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        this.isProcessing = true;
        this.errorMessage = '';
        this.customChartData = null;

        try {
            // Check for Dashboard Data format first
            const rawData = await this.csvParser.parseRawCsv(file);
            const isDashboardData = rawData.length > 0 &&
                Object.prototype.hasOwnProperty.call(rawData[0], 'Type') &&
                Object.prototype.hasOwnProperty.call(rawData[0], 'Id');

            if (isDashboardData) {
                this.dashboardService.updateDashboardFromCsv(rawData);
                this.fileName = `Dashboard Updated: ${file.name}`;
                this.lastUpdated = Date.now();
                this.dashboardUpdated = true;
                this.customChartData = null;
                this.isProcessing = false;
                input.value = '';
                return;
            }

            // Standard Analysis Flow
            this.dashboardUpdated = false;
            this.customChartData = await this.csvParser.parseCsv(file);
            this.saveState();
            this.fileName = file.name;
        } catch (error) {
            console.error('CSV Parse Error:', error);
            this.errorMessage = 'Failed to parse CSV. Please ensure it has headers and data.';
        } finally {
            this.isProcessing = false;
            input.value = '';
        }
    }

    navigateToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    onChartTypeChange(type: string) {
        this.selectedChartType = type as any;
        this.saveState();
    }

    private saveState() {
        if (this.customChartData) {
            this.analyticsState.saveState({
                data: this.customChartData,
                timestamp: Date.now(),
                fileName: this.fileName || 'Custom Data',
                chartType: this.selectedChartType
            });
            this.lastUpdated = Date.now();
        }
    }

    clearData() {
        this.analyticsState.clearState();
        this.customChartData = null;
        this.lastUpdated = null;
        this.fileName = null;
    }

    isMetricCard(
        card: CardConfig
    ): card is Extract<CardConfig, { type: 'metric' }> {
        return card.type === 'metric';
    }

    isChartCard(
        card: CardConfig
    ): card is Extract<CardConfig, { type: 'chart' }> {
        return card.type === 'chart';
    }

    isTableCard(
        card: CardConfig
    ): card is Extract<CardConfig, { type: 'table' }> {
        return card.type === 'table';
    }

    getGridColumn(card: CardConfig): string {
        return card.gridColumn || 'span 1';
    }
}
