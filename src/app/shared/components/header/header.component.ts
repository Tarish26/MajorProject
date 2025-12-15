import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
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
  readonly user$: Observable<User>;
  readonly pageTitle = new BehaviorSubject<string>('Dashboard');
  readonly isDarkMode$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
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
}
