import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideUsers, lucideChevronLeft, lucideBriefcase } from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIcon],
  viewProviders: [provideIcons({ lucideLayoutDashboard, lucideUsers, lucideChevronLeft, lucideBriefcase })],
  template: `
    <aside
      class="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col h-full transition-[width] duration-300 ease-in-out z-20 relative"
      [class.w-64]="!isCollapsed()"
      [class.w-[4.5rem]]="isCollapsed()"
    >
      <div class="h-16 flex items-center border-b border-gray-200 dark:border-gray-800 shrink-0 transition-all duration-300 ease-in-out"
           [class.justify-between]="!isCollapsed()" [class.justify-center]="isCollapsed()"
           [class.px-4]="!isCollapsed()" [class.px-0]="isCollapsed()">

        <a routerLink="/" class="flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out"
           [class.w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()" [class.ml-0]="isCollapsed()"
           [class.w-auto]="!isCollapsed()" [class.opacity-100]="!isCollapsed()">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <ng-icon name="lucideBriefcase" size="20"></ng-icon>
          </div>
          <span class="font-bold text-base text-primary ml-2 truncate transition-all duration-300 ease-in-out">Intern Mngt</span>
        </a>

        <!-- Collapse Toggle Button -->
        <button
          (click)="toggleCollapse()"
          class="w-7 h-7 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none shrink-0"
        >
          <ng-icon
            name="lucideChevronLeft"
            size="16"
            class="transition-transform duration-300"
            [class.rotate-180]="isCollapsed()"
          ></ng-icon>
        </button>
      </div>

      <div class="flex-1 overflow-x-hidden overflow-y-auto py-6 custom-scrollbar transition-all duration-300 ease-in-out"
           [class.px-3]="!isCollapsed()" [class.px-2]="isCollapsed()">
        <ul [class.space-y-1.5]="!isCollapsed()" [class.space-y-2]="isCollapsed()">
          <li>
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400 font-medium"
              [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-all duration-300 ease-in-out group"
              [class.px-3]="!isCollapsed()" [class.py-2.5]="!isCollapsed()"
              [class.justify-center]="isCollapsed()" [class.p-3]="isCollapsed()" [title]="isCollapsed() ? 'Dashboard' : ''"
            >
              <ng-icon name="lucideLayoutDashboard" size="18" class="group-hover:scale-110 transition-transform duration-200 shrink-0"></ng-icon>
              <span class="whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out"
                    [class.max-w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()" [class.ml-0]="isCollapsed()"
                    [class.max-w-[200px]]="!isCollapsed()" [class.opacity-100]="!isCollapsed()" [class.ml-3]="!isCollapsed()">
                Dashboard
              </span>
            </a>
          </li>
          <li>
            <a
              routerLink="/interns"
              routerLinkActive="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400 font-medium"
              class="flex items-center rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-all duration-300 ease-in-out group"
              [class.px-3]="!isCollapsed()" [class.py-2.5]="!isCollapsed()"
              [class.justify-center]="isCollapsed()" [class.p-3]="isCollapsed()" [title]="isCollapsed() ? 'Quản lý TTS' : ''"
            >
              <ng-icon name="lucideUsers" size="18" class="group-hover:scale-110 transition-transform duration-200 shrink-0"></ng-icon>
              <span class="whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out"
                    [class.max-w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()" [class.ml-0]="isCollapsed()"
                    [class.max-w-[200px]]="!isCollapsed()" [class.opacity-100]="!isCollapsed()" [class.ml-3]="!isCollapsed()">
                Quản lý TTS
              </span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: var(--border);
      border-radius: 4px;
    }
  `]
})
export class SidebarComponent {
  isCollapsed = signal(false);

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }
}
