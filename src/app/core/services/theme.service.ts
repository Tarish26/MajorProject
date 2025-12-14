import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'dashboard-theme';
  private readonly themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());

  readonly theme$: Observable<Theme> = this.themeSubject.asObservable();
  readonly isDark$: Observable<boolean> = this.theme$.pipe(
    map(theme => theme === 'dark')
  );

  constructor() {
    // Apply theme on initialization
    const initialTheme = this.themeSubject.value;
    this.applyTheme(initialTheme);
    
    // Watch for theme changes and apply them
    this.theme$.subscribe(theme => {
      this.applyTheme(theme);
      this.saveTheme(theme);
    });
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const saved = localStorage.getItem(this.themeKey);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  toggleTheme(): void {
    const current = this.themeSubject.value;
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
  }
}
