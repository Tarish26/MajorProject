import { Component, input, output, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { User } from '../../../core/models/dashboard.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isCollapsed1 = input<boolean>();
  toggleMobileNav = output<void>();
  readonly isMenuOpen = new BehaviorSubject<boolean>(false);
  readonly user$: Observable<User | null | undefined>;
  readonly pageTitle = new BehaviorSubject<string>('Dashboard');
  readonly isDarkMode$: Observable<boolean>;

  isFullscreen = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private dashboardService: DashboardService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.user$ = this.authService.user$;
    this.isDarkMode$ = this.themeService.isDark$;
  }

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }

  toggleMenu(): void {
    this.isMenuOpen.next(!this.isMenuOpen.value);
  }

  closeMenu(): void {
    this.isMenuOpen.next(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }

  toggleFullscreen(): void {
    if (!this.document.fullscreenElement) {
      this.document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      this.isFullscreen = true;
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
        this.isFullscreen = false;
      }
    }
  }

  exportConfig(): void {
    this.dashboardService.config$.pipe(take(1)).subscribe(config => {
      if (config) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = this.document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', 'dashboard_config_export.json');
        this.document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    });
  }

  importConfig(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          const success = this.dashboardService.importConfig(content);
          if (success) {
            console.log('Configuration imported successfully.');
          } else {
            console.error('Failed to import configuration.');
          }
        }
      };
      reader.readAsText(file);
    }
    // clear input value so the same file can be uploaded again if needed
    input.value = '';
  }
}
