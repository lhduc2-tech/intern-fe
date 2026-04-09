import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideUser, lucideLogOut, lucideChevronDown } from '@ng-icons/lucide';
import { ZardButtonComponent } from '@/shared/components/button';
import { AuthUseCase } from '@/features/auth/application/auth.usecase';

@Component({
  selector: 'app-headbar',
  standalone: true,
  imports: [NgIcon, ZardButtonComponent],
  viewProviders: [provideIcons({ lucideMenu, lucideUser, lucideLogOut, lucideChevronDown })],
  template: `
    <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50 w-full">
      <div class="flex items-center gap-4">
        <button z-button variant="ghost" size="icon" class="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
          <ng-icon name="lucideMenu" size="20"></ng-icon>
        </button>
      </div>

      <div class="flex items-center justify-end relative">
        <button
          (click)="toggleDropdown()"
          class="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 pr-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
        >
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-950">
            <ng-icon name="lucideUser" size="16"></ng-icon>
          </div>
          <div class="hidden md:flex flex-col items-start leading-none text-left">
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ fullName() }}</span>
            <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Quản trị viên</span>
          </div>
          <ng-icon name="lucideChevronDown" size="16" class="text-gray-400 ml-1 hidden md:block" [class.rotate-180]="isDropdownOpen()"></ng-icon>
        </button>

        <!-- Dropdown Menu -->
        @if(isDropdownOpen()) {
          <div
            class="absolute right-0 top-[calc(100%+0.5rem)] w-56 bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100 z-50"
          >
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 md:hidden">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ fullName() }}</p>
              <p class="text-xs text-gray-500 truncate">Quản trị viên</p>
            </div>
            <div class="p-1">
              <button class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors flex items-center gap-2">
                <ng-icon name="lucideUser" size="16"></ng-icon>
                Thông tin cá nhân
              </button>
              <div class="h-[1px] bg-gray-100 dark:bg-gray-800 my-1"></div>
              <button
                (click)="onLogout()"
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors flex items-center gap-2 font-medium"
              >
                <ng-icon name="lucideLogOut" size="16"></ng-icon>
                Đăng xuất
              </button>
            </div>
          </div>

          <!-- Backdrop for closing dropdown -->
          <div class="fixed inset-0 z-40" (click)="closeDropdown()"></div>
        }
      </div>
    </header>
  `
})
export class HeadbarComponent implements OnInit {
  private readonly authUseCase = inject(AuthUseCase);
  private readonly router = inject(Router);

  isDropdownOpen = signal(false);
  fullName = signal('Admin User');

  ngOnInit() {
    this.fullName.set(this.authUseCase.getUserFullName());
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  onLogout() {
    this.authUseCase.logout();
    this.router.navigate(['/login']);
  }
}
