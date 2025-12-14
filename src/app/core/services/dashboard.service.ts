import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardConfig, CardConfig, Metric, ChartData, Activity } from '../models/dashboard.models';
import { defaultDashboardConfig } from '../config/dashboard.config';

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
   * Get the full dashboard configuration
   */
  getConfig(): Observable<DashboardConfig> {
    // Check if we already have data to avoid resetting state
    const current = this.configSubject.getValue();
    if (current) {
      return of(current);
    }

    // Simulate a real API call that returns data
    return of(defaultDashboardConfig).pipe(
      delay(1000), // Wait 1 second
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