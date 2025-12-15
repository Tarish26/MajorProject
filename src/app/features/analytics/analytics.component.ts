import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { ActivityTableComponent } from '../../shared/components/activity-table/activity-table.component';
import {
    CardConfig,
    DashboardConfig,
} from '../../core/models/dashboard.models';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [
        CommonModule,
        MetricCardComponent,
        ChartCardComponent,
        ActivityTableComponent,
    ],
    templateUrl: './analytics.component.html',
    styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit {
    private dashboardService = inject(DashboardService);

    readonly cards$: Observable<CardConfig[]> = this.dashboardService.cards$;
    readonly config$: Observable<DashboardConfig | null> = this.dashboardService.config$;

    ngOnInit() {
        this.dashboardService.getConfig('analytics').subscribe();
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
