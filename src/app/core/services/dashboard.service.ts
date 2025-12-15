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
  getConfig(type: 'dashboard' | 'analytics' | 'users' | 'products' | 'orders' = 'dashboard'): Observable<DashboardConfig> {
    // Determine which config to load
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

    // Simulate a real API call that returns data
    return of(configToLoad).pipe(
      delay(500), // Wait 0.5 second
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

    this.configSubject.next({
      ...currentConfig,
      cards: updatedCards
    });
  }
}