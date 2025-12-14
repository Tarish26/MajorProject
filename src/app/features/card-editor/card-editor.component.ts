import { Component, OnInit, OnDestroy, Signal, WritableSignal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, startWith, filter, take } from 'rxjs/operators';
import { DashboardService } from '../../core/services/dashboard.service';
import { CardConfig, CardStyles, MetricCardConfig, ChartCardConfig } from '../../core/models/dashboard.models';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { ActivityTableComponent } from '../../shared/components/activity-table/activity-table.component';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MetricCardComponent, ChartCardComponent, ActivityTableComponent],
  templateUrl: './card-editor.component.html',
  styleUrl: './card-editor.component.scss'
})
export class CardEditorComponent implements OnInit, OnDestroy {
  cards$: Observable<CardConfig[]>;
  selectedCard: WritableSignal<CardConfig | null> = signal(null);

  editorForm: FormGroup;

  // Signals for reactive preview
  currentStyles: Signal<CardStyles | undefined>;
  previewMetric: Signal<any | null>; // Keeping any to avoid strict type issues with partial updates
  chartType: Signal<'line' | 'bar' | 'pie'>;

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder
  ) {
    this.cards$ = this.dashboardService.cards$;

    this.editorForm = this.fb.group({
      cardId: [''],
      // Data-specific config
      config: this.fb.group({
        icon: [''], // For Metric
        chartType: ['line'], // For Chart
        legendPosition: ['top'] // For Chart
      }),
      styles: this.fb.group({
        // Container
        backgroundColor: [''],
        backgroundGradient: [''],
        borderColor: [''],
        borderWidth: [''],
        borderRadius: [''],
        padding: [''],
        boxShadow: [''],

        // Typography - Title
        titleFontSize: [''],
        titleFontWeight: [''],
        titleFontColor: [''],

        // Typography - Value
        valueFontSize: [''],
        valueFontWeight: [''],
        valueFontColor: [''],

        // Typography - Global
        fontFamily: [''],
        fontColor: ['']
      })
    });

    // Initialize signals
    const stylesGroup = this.editorForm.get('styles') as FormGroup;
    const initialStyles = stylesGroup.value || {};
    this.currentStyles = toSignal(
      stylesGroup.valueChanges.pipe(startWith(initialStyles)),
      { initialValue: initialStyles }
    ) as Signal<CardStyles | undefined>;

    const configGroup = this.editorForm.get('config') as FormGroup;
    const configSignal = toSignal(
      configGroup.valueChanges.pipe(startWith(configGroup.value)),
      { initialValue: configGroup.value }
    );

    this.chartType = computed(() => {
      const type = configSignal()?.chartType;
      return (['line', 'bar', 'pie'].includes(type) ? type : 'line') as 'line' | 'bar' | 'pie';
    });

    this.previewMetric = computed(() => {
      const card = this.selectedCard();
      if (!card || card.type !== 'metric') return null;
      const formIcon = configSignal()?.icon;
      return {
        ...card.data,
        icon: formIcon || card.data.icon
      };
    });
  }

  ngOnInit(): void {
    // Ensure data is loaded
    this.dashboardService.getConfig().pipe(take(1)).subscribe();

    // Handle Card Selection
    this.editorForm.get('cardId')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cardId => {
      if (cardId) {
        this.loadCardStyles(cardId);
      } else {
        this.selectedCard.set(null);
        this.stylesGroup.reset();
        this.configGroup.reset();
      }
    });

    // Auto-select first card if available and nothing selected
    this.cards$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cards => {
      // 1. Auto-select if nothing selected
      if (!this.editorForm.get('cardId')?.value && cards.length > 0) {
        this.editorForm.patchValue({ cardId: cards[0].id });
      }

      // 2. Refresh selected card reference if it exists
      const currentId = this.editorForm.get('cardId')?.value;
      if (currentId) {
        const updatedCard = cards.find(c => c.id === currentId);
        if (updatedCard) {
          const wasNull = !this.selectedCard();
          this.selectedCard.set(updatedCard);
          // Only reload form if we were previously null (initial load)
          // Otherwise avoid overwriting unsaved form changes while typing
          if (wasNull) {
            this.loadCardStyles(currentId);
          }
        }
      }
    });
  }

  get stylesGroup(): FormGroup {
    return this.editorForm.get('styles') as FormGroup;
  }

  get configGroup(): FormGroup {
    return this.editorForm.get('config') as FormGroup;
  }

  loadCardStyles(cardId: string): void {
    this.cards$.pipe(take(1)).subscribe(cards => {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        this.selectedCard.set(card);

        // Prepare config values
        const configValues: any = {};
        if (card.type === 'metric') {
          configValues.icon = card.data?.icon || '';
        } else if (card.type === 'chart') {
          configValues.chartType = card.chartType || 'line';
          configValues.legendPosition = card.legendPosition || 'top';
        }

        // Use reset with values to emit a single event with the new state
        // This ensures the signals (which startWith current value) get the update
        const styles = card.styles || {};
        this.stylesGroup.reset(styles);
        this.configGroup.reset(configValues);
      }
    });
  }

  saveStyles(): void {
    const card = this.selectedCard();
    if (!card) return;

    const formValues = this.stylesGroup.value;
    // Filter out empty values to keep config clean
    const cleanStyles: CardStyles = {};

    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== '') {
        (cleanStyles as any)[key] = formValues[key];
      }
    });

    // Merge with existing styles to avoid data loss of properties not in the form
    const styles = {
      ...(card.styles || {}),
      ...cleanStyles
    };

    const updates: Partial<CardConfig> = { styles };
    const configValues = this.configGroup.value;

    // Handle type-specific updates
    if (card.type === 'metric' && configValues.icon) {
      const metricCard = card as MetricCardConfig;
      (updates as Partial<MetricCardConfig>).data = { ...metricCard.data, icon: configValues.icon };
    } else if (card.type === 'chart') {
      const chartCard = card as ChartCardConfig;
      const chartUpdates = updates as Partial<ChartCardConfig>;
      if (configValues.chartType) chartUpdates.chartType = configValues.chartType;
      if (configValues.legendPosition) chartUpdates.legendPosition = configValues.legendPosition;
    }

    this.dashboardService.updateCard(card.id, updates);
  }

  resetStyles(): void {
    const card = this.selectedCard();
    if (card) {
      this.stylesGroup.reset();
      this.configGroup.reset();
      if (card.styles) {
        this.stylesGroup.patchValue(card.styles);
      }
      // Reload config
      this.loadCardStyles(card.id);
    }
  }

  // Helpers for template display
  getCardIcon(type: string): string {
    switch (type) {
      case 'metric': return '📊';
      case 'chart': return '📈';
      case 'table': return '📋';
      default: return '📄';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
