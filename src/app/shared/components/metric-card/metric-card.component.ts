import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Metric, CardStyles } from '../../../core/models/dashboard.models';
import { getCardStyles, getTitleStyles, getValueStyles, getLabelStyles } from '../../../core/utils/style-utils';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {
  @Input({ required: true }) metric!: Metric;

  private _styles = signal<CardStyles | undefined>(undefined);
  @Input()
  set styles(value: CardStyles | undefined) {
    this._styles.set(value);
  }

  readonly cardStyles = computed(() => getCardStyles(this._styles()));
  readonly titleStyles = computed(() => getTitleStyles(this._styles()));
  readonly valueStyles = computed(() => getValueStyles(this._styles()));
  readonly labelStyles = computed(() => getLabelStyles(this._styles()));
}
