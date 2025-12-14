import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity, CardStyles } from '../../../core/models/dashboard.models';
import { getCardStyles, getTitleStyles, getLabelStyles } from '../../../core/utils/style-utils';

@Component({
  selector: 'app-activity-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss'
})
export class ActivityTableComponent {
  @Input({ required: true }) activities: Activity[] = [];

  private _styles = signal<CardStyles | undefined>(undefined);
  @Input()
  set styles(value: CardStyles | undefined) {
    this._styles.set(value);
  }

  readonly cardStyles = computed(() => getCardStyles(this._styles()));
  readonly titleStyles = computed(() => getTitleStyles(this._styles()));
  readonly labelStyles = computed(() => getLabelStyles(this._styles()));

  getStatusIcon(status: Activity['status']): string {
    switch (status) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }

  formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}
