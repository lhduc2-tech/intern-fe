import { Component } from '@angular/core';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUsers, lucideActivity, lucideCheckCircle, lucideArrowUpRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ZardCardComponent, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideUsers, lucideActivity, lucideCheckCircle, lucideArrowUpRight })],
  template: `
    <div class="flex items-center justify-center h-full min-h-[60vh] animate-in fade-in zoom-in duration-500">
      <z-card class="max-w-md w-full shadow-sm text-center">
        <div class="p-12 flex flex-col items-center justify-center">
          <div class="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <ng-icon name="lucideActivity" size="32"></ng-icon>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tính năng đang chờ phát triển...</h2>
          <p class="text-gray-500 dark:text-gray-400">Dashboard tổng quan số liệu sẽ được cập nhật trong những phiên bản tiếp theo.</p>
        </div>
      </z-card>
    </div>
  `
})
export class DashboardComponent {}
