import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheckCircle2, lucideXCircle, lucideInfo, lucideAlertTriangle, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'z-toaster',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ lucideCheckCircle2, lucideXCircle, lucideInfo, lucideAlertTriangle, lucideX })],
  template: `
    <div class="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col p-4 sm:bottom-0 sm:right-0 sm:top-auto md:max-w-[420px] gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all bg-background text-foreground animate-in fade-in slide-in-from-bottom-5">
          <div class="flex items-start gap-3 w-full">
            @if (toast.type === 'success') {
              <ng-icon name="lucideCheckCircle2" class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            } @else if (toast.type === 'error') {
              <ng-icon name="lucideXCircle" class="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            } @else if (toast.type === 'warning') {
              <ng-icon name="lucideAlertTriangle" class="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            } @else if (toast.type === 'info') {
              <ng-icon name="lucideInfo" class="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            }
            <div class="grid gap-1 w-full">
              @if (toast.title) {
                <div class="text-sm font-semibold">{{ toast.title }}</div>
              }
              @if (toast.description) {
                <div class="text-sm font-medium opacity-90">{{ toast.description }}</div>
              }
            </div>
          </div>
          <button (click)="toastService.remove(toast.id)" class="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100">
            <ng-icon name="lucideX" class="h-4 w-4" />
          </button>
        </div>
      }
    </div>
  `
})
export class ZardToasterComponent {
  readonly toastService = inject(ToastService);
}

