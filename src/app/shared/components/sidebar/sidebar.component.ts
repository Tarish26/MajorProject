import { Component, model, signal, input, output } from '@angular/core'; // <-- CHANGED
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // <-- Added NavigationEnd
import { filter } from 'rxjs/operators'; // <-- Added filter

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  // Use model() for two-way state.
  // The parent can now bind with [(isCollapsed)]="parentSignal"
  // Use model() for two-way state.
  // The parent can now bind with [(isCollapsed)]="parentSignal"
  isCollapsed = model<boolean>();

  // Mobile state
  mobileOpen = input<boolean>();
  closeMobile = output<void>();

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Orders', icon: 'shopping_cart', route: '/orders' },
    { label: 'Products', icon: 'inventory', route: '/products' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  readonly currentRoute = signal<string>('');

  constructor(private router: Router) {
    // Set the initial value
    this.currentRoute.set(this.router.url);

    // Refinement: Only listen for NavigationEnd events
    // This is more efficient and accurate.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.urlAfterRedirects);
    });
  }

  toggleSidebar(): void {
    // Use .update() to change the signal's value
    this.isCollapsed.update(value => !value); // <-- CHANGED
  }

  isActive(route: string): boolean {
    return this.currentRoute() === route;
  }
}