import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardConfig, CardConfig, Metric, ChartData, Activity } from '../models/dashboard.models';
import { defaultDashboardConfig } from '../config/dashboard.config';
import { analyticsConfig } from '../config/analytics.config';
import { usersConfig } from '../config/users.config';
import { productsConfig } from '../config/products.config';
import { ordersConfig } from '../config/orders.config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Start with null.
  private readonly configSubject = new BehaviorSubject<DashboardConfig | null>(null);

  // Track which config is currently active and cache them consistently
  private activeType: string = 'dashboard';
  private configCaches = new Map<string, DashboardConfig>();

  // The config$ observable will now emit null at first.
  readonly config$: Observable<DashboardConfig | null> = this.configSubject.asObservable();

  // Update cards$ to handle the null case
  readonly cards$: Observable<CardConfig[]> = this.config$.pipe(
    map(config => (config ? config.cards : []) // If config is null, use empty array
      .filter(card => card.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
    )
  );

  /**
   * Get the dashboard configuration
   */
  importConfig(configJson: string): boolean {
    try {
      const config = JSON.parse(configJson) as DashboardConfig;
      if (config && Array.isArray(config.cards)) {
        this.configCaches.set(this.activeType, config);
        this.configSubject.next(config);
        console.log('Dashboard Config Imported Successfully');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import JSON configuration', e);
      return false;
    }
  }

  updateDashboardFromCsv(rows: any[]) {
    // Always start from the default dashboard config, or the existing cached one.
    // Use cached if available, else clone default
    const cached = this.configCaches.get('dashboard');
    const baseConfig = cached
      ? JSON.parse(JSON.stringify(cached))
      : JSON.parse(JSON.stringify(defaultDashboardConfig));

    // Group CSV data by ID
    const dataMap = new Map<string, any[]>();

    // First pass: Group
    rows.forEach((row: any) => {
      // Ensure row has Id
      if (row.Id) {
        if (!dataMap.has(row.Id)) {
          dataMap.set(row.Id, []);
        }
        dataMap.get(row.Id)?.push(row);
      }
    });

    const updatedCards = baseConfig.cards.map((card: CardConfig) => {
      const cardRows = dataMap.get(card.id);

      // If no data for this card, keep as is
      if (!cardRows || cardRows.length === 0) return card;

      // Deep clone card to avoid mutating
      const newCard = JSON.parse(JSON.stringify(card));

      if (newCard.type === 'metric') {
        const row = cardRows[0];
        if (row.Label) newCard.data.title = row.Label;
        if (row.Value !== undefined) newCard.data.value = row.Value;
        if (row.Change !== undefined && row.Change !== '') newCard.data.change = parseFloat(row.Change);
        if (row.ChangeType) newCard.data.changeType = row.ChangeType;
      }
      else if (newCard.type === 'chart') {
        // Collect labels and data points
        const labels: string[] = [];
        const data: number[] = [];

        cardRows.forEach((r: any) => {
          if (r.Label) {
            labels.push(r.Label);
          }
          if (r.Value !== undefined) {
            const val = parseFloat(String(r.Value).replace(/[^0-9.-]+/g, ''));
            data.push(isNaN(val) ? 0 : val);
          }
        });

        if (newCard.chartData && newCard.chartData.datasets.length > 0) {
          newCard.chartData.labels = labels;
          newCard.chartData.datasets[0].data = data;
        }
      }
      else if (newCard.type === 'table') {
        // Convert rows to activities
        newCard.data = cardRows.map((r: any, i: number) => ({
          id: String(i),
          type: r.Category ? r.Category.toLowerCase() : 'info',
          description: r.Description || '',
          timestamp: r.Date ? new Date(r.Date) : new Date(),
          user: r.User || 'Unknown',
          status: r.Status || 'info'
        }));
      }

      return newCard;
    });

    // Save to cache
    const finalConfig = {
      ...baseConfig,
      cards: updatedCards
    };
    this.configCaches.set('dashboard', finalConfig);
    console.log('Dashboard Config Updated in Cache');

    // If the active type is dashboard, emit it right away so UI updates
    if (this.activeType === 'dashboard') {
      this.configSubject.next(finalConfig);
    }
  }

  getConfig(type: 'dashboard' | 'analytics' | 'users' | 'products' | 'orders' = 'dashboard'): Observable<DashboardConfig> {
    this.activeType = type;

    // If we have a cached version for this type, return that.
    if (this.configCaches.has(type)) {
      console.log(`Serving cached ${type} config`);
      return of(this.configCaches.get(type)!).pipe(
        // Remove delay or minimize it effectively
        tap(config => this.configSubject.next(config))
      );
    }

    // Determine which config to load defaults from
    let configToLoad: DashboardConfig;
    switch (type) {
      case 'analytics':
        configToLoad = analyticsConfig;
        break;
      case 'users':
        configToLoad = usersConfig;
        break;
      case 'products':
        configToLoad = productsConfig;
        break;
      case 'orders':
        configToLoad = ordersConfig;
        break;
      default:
        configToLoad = defaultDashboardConfig;
        break;
    }

    // Clone it so we don't accidentally mutate the original imported defaults
    const clonedConfig = JSON.parse(JSON.stringify(configToLoad));

    // Save to cache so next time we return the cached copy
    this.configCaches.set(type, clonedConfig);

    // Simulate a real API call that returns data
    return of(clonedConfig).pipe(
      delay(500), // Wait 0.5 second for non-cached
      // Use tap() to update the subject when the data "arrives"
      tap(config => {
        this.configSubject.next(config);
      })
    );
  }

  updateCard(cardId: string, updates: Partial<CardConfig>): void {
    const currentConfig = this.configSubject.getValue();
    if (!currentConfig) return;

    const updatedCards = currentConfig.cards.map(card => {
      if (card.id === cardId) {
        return { ...card, ...updates } as CardConfig;
      }
      return card;
    });

    const newConfig = {
      ...currentConfig,
      cards: updatedCards
    };

    // Keep the cache sync'd so the changes don't get lost
    this.configCaches.set(this.activeType, newConfig);
    this.configSubject.next(newConfig);
  }
}