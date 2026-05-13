
import { Injectable } from '@angular/core';
import { ChartData } from '../models/dashboard.models';


export interface SavedChartState {
    data: ChartData;
    timestamp: number;
    fileName?: string;
    chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
    options?: any;
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsStateService {
    private readonly STORAGE_KEY = 'analytics_custom_chart_v1';

    constructor() { }

    saveState(state: Partial<SavedChartState>): void {
        const fullState: SavedChartState = {
            data: state.data!,
            timestamp: Date.now(),
            fileName: state.fileName,
            chartType: state.chartType,
            options: state.options
        };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fullState));
        } catch (e) {
            console.error('Failed to save analytics state to localStorage', e);
        }
    }

    getState(): SavedChartState | null {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to load analytics state', e);
            return null;
        }
    }

    clearState(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    hasState(): boolean {
        return !!localStorage.getItem(this.STORAGE_KEY);
    }
}
