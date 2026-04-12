import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeadbarComponent } from './components/headbar/headbar.component';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeadbarComponent, CdkScrollable],
  template: `
    <div class="flex h-screen w-full bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden font-sans">

      <!-- Lọc z-index và layout sidebar -->
      <app-sidebar class="hidden lg:block shrink-0 shadow-sm border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"></app-sidebar>

      <div class="flex flex-col flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
        <!-- Headbar bên trên -->
        <app-headbar class="shrink-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 z-30"></app-headbar>

        <!-- Main content với router-outlet -->
        <main cdkScrollable class="flex-1 overflow-y-auto w-full p-4 lg:p-6 custom-scrollbar">
          <div class="max-w-[1600px] mx-auto w-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: oklch(0.5 0 0);
    }
  `]
})
export class MainLayoutComponent {}
