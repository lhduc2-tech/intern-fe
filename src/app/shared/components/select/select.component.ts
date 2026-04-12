import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  input,
  model,
  signal,
  HostListener,
  ElementRef,
  inject,
  contentChildren,
  afterNextRender,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideCheck } from '@ng-icons/lucide';
import { cva } from 'class-variance-authority';
import { mergeClasses } from '@/shared/utils/merge-classes';

export const selectVariants = cva(
  'flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  {
    variants: {
      zSize: {
        sm: 'h-8 text-xs px-2',
        default: 'h-10 px-3 py-2',
        lg: 'h-12 text-base px-4 py-3',
      },
      zStatus: {
        error: 'border-destructive focus:ring-destructive',
        warning: 'border-yellow-500 focus:ring-yellow-500',
        success: 'border-green-500 focus:ring-green-500',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

@Component({
  selector: 'z-select-option',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div
      class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      [class.bg-accent]="selected()"
      [class.text-accent-foreground]="selected()"
      (click)="selectOption()"
    >
      <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        @if (selected()) {
          <ng-icon name="lucideCheck" class="h-4 w-4" />
        }
      </span>
      <ng-content />
    </div>
  `,
})
export class ZardSelectOptionComponent {
  readonly value = input.required<any>();
  readonly label = input<string>('');
  readonly disabled = input(false);
  readonly selected = signal(false);

  private readonly parent = inject(forwardRef(() => ZardSelectComponent));
  readonly el = inject(ElementRef);

  getLabel(): string {
    return this.label() || this.el.nativeElement.textContent?.trim() || '';
  }

  selectOption(): void {
    if (!this.disabled()) {
      this.parent.selectValue(this.value(), this.getLabel());
    }
  }
}

@Component({
  selector: 'z-select',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSelectComponent),
      multi: true,
    },
    provideIcons({ lucideChevronDown, lucideCheck }),
  ],
  template: `
    <div class="relative w-full">
      <button
        type="button"
        [class]="containerClass()"
        [disabled]="disabled()"
        (click)="toggleOverlay()"
      >
        <span [class.text-muted-foreground]="!hasValue()">
          {{ displayLabel() || placeholder() }}
        </span>
        <ng-icon name="lucideChevronDown" class="h-4 w-4 opacity-50" />
      </button>

      @if (isOpen()) {
        <div class="absolute z-50 min-w-[8rem] mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 slide-in-from-top-1">
          <div class="p-1 max-h-60 overflow-y-auto">
            <ng-content />
          </div>
        </div>
      }
    </div>
  `,
})
export class ZardSelectComponent implements ControlValueAccessor {
  readonly class = input<string>('');
  readonly placeholder = input('Select an option');
  readonly disabled = model(false);
  readonly zStatus = input<'error' | 'warning' | 'success' | undefined>();
  readonly zSize = input<'sm' | 'default' | 'lg'>('default');

  readonly options = contentChildren(ZardSelectOptionComponent);

  private onChange: any = () => {};
  private onTouched: any = () => {};

  readonly isOpen = signal(false);
  readonly hasValue = signal(false);
  readonly displayLabel = signal('');
  private currentValue: any = null;

  private readonly el = inject(ElementRef);

  constructor() {
    effect(() => {
      this.options();
      setTimeout(() => this.updateSelectedOptions());
    });
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isOpen() && !this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  get containerClass() {
    return () => mergeClasses(selectVariants({ zSize: this.zSize(), zStatus: this.zStatus() }), this.class());
  }

  toggleOverlay() {
    if (!this.disabled()) {
      const willOpen = !this.isOpen();
      this.isOpen.set(willOpen);
      if (willOpen) {
        setTimeout(() => this.scrollToSelected());
      }
    }
  }

  private scrollToSelected() {
    const selected = this.options().find((o) => o.selected());
    if (selected) {
      selected.el.nativeElement.scrollIntoView({ block: 'center' });
    }
  }

  selectValue(value: any, label: string) {
    this.currentValue = value;
    this.displayLabel.set(label);
    this.hasValue.set(true);
    this.isOpen.set(false);
    this.onChange(value);
    this.updateSelectedOptions();
  }

  writeValue(value: any): void {
    this.currentValue = value;
    setTimeout(() => this.updateSelectedOptions());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  private updateSelectedOptions() {
    let found = false;
    this.options().forEach((option) => {
      const isSelected = option.value() === this.currentValue;
      option.selected.set(isSelected);
      if (isSelected) {
        this.displayLabel.set(option.getLabel());
        this.hasValue.set(true);
        found = true;
      }
    });

    if (!found) {
      if (this.currentValue === null || this.currentValue === undefined || this.currentValue === '') {
        this.displayLabel.set('');
        this.hasValue.set(false);
      }
    }
  }
}

