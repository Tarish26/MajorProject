import { Component, inject, OnInit } from '@angular/core'; // Removed OnInit
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Removed BehaviorSubject
import { DashboardService } from '../../core/services/dashboard.service';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { ActivityTableComponent } from '../../shared/components/activity-table/activity-table.component';
import {
  CardConfig,
  DashboardConfig,
} from '../../core/models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    ChartCardComponent,
    ActivityTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {


  readonly cards$!: Observable<CardConfig[]>;
  readonly config$!: Observable<DashboardConfig | null>;
  dashboardService = inject(DashboardService);

  constructor() {
    // This is perfect. Just assign the observables.
    this.cards$ = this.dashboardService.cards$;
    this.config$ = this.dashboardService.config$;
  }
  ngOnInit() {

    // Manually trigger the load *once* in the service.
    // The service will then update the observables for the async pipes.
    this.dashboardService.getConfig().subscribe();
  }


  // All your type guards and helper functions are perfect.
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
