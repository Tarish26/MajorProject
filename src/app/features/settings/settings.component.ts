import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  readonly isDarkMode$: Observable<boolean>;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.isDark$;
    this.settingsForm = this.fb.group({
      notifications: [true],
      emailUpdates: [true],
      darkMode: [false],
      language: ['en'],
      timezone: ['UTC']
    });
  }

  ngOnInit(): void {
    // Initialize form with current theme
    const initialThemeSub = this.themeService.isDark$.pipe(
      distinctUntilChanged()
    ).subscribe(isDark => {
      this.settingsForm.patchValue({ darkMode: isDark }, { emitEvent: false });
    });
    this.subscriptions.add(initialThemeSub);

    // Watch for checkbox changes
    const formChangeSub = this.settingsForm.get('darkMode')?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(isDark => {
      this.themeService.setTheme(isDark ? 'dark' : 'light');
    });
    if (formChangeSub) {
      this.subscriptions.add(formChangeSub);
    }

    // Watch for theme service changes (when toggled from header)
    const themeChangeSub = this.themeService.isDark$.pipe(
      distinctUntilChanged()
    ).subscribe(isDark => {
      const currentValue = this.settingsForm.get('darkMode')?.value;
      if (currentValue !== isDark) {
        this.settingsForm.patchValue({ darkMode: isDark }, { emitEvent: false });
      }
    });
    this.subscriptions.add(themeChangeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleDarkMode(): void {
    this.themeService.isDark$.pipe(
      distinctUntilChanged(),
      take(1),
      map(isDark => isDark ? 'light' : 'dark')
    ).subscribe(newTheme => {
      this.themeService.setTheme(newTheme);
    });
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      // Dark mode is already saved by theme service
      console.log('Settings saved:', this.settingsForm.value);
    }
  }
}
