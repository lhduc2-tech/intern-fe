import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternUseCase } from '../../application/intern.usecase';
import { InternResponse, InternSearchRequest, PageResponse } from '../../domain/intern.model';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardSelectComponent, ZardSelectOptionComponent } from '@/shared/components/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideSearch, lucideEdit, lucideTrash2, lucideFilter } from '@ng-icons/lucide';

@Component({
  selector: 'app-intern-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZardButtonComponent, ZardCardComponent, ZardSelectComponent, ZardSelectOptionComponent, NgIcon],
  viewProviders: [provideIcons({ lucidePlus, lucideSearch, lucideEdit, lucideTrash2, lucideFilter })],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý thực tập sinh</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Tra cứu, thêm mới và quản lý thông tin TTS trong hệ thống.</p>
        </div>
      </div>

      <z-card class="shadow-sm border-gray-200 dark:border-gray-800">
        <div class="p-6">
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="flex flex-wrap items-end gap-3 mb-6 relative">
            <div class="w-64">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Tài khoản công ty</label>
              <div class="relative">
                <ng-icon name="lucideSearch" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></ng-icon>
                <input formControlName="companyAccount" type="text" class="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm" placeholder="VD: namnv..." />
              </div>
            </div>
            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Trạng thái</label>
              <div class="relative z-select-container">
                <ng-icon name="lucideFilter" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"></ng-icon>
                <z-select formControlName="status" class="w-full text-sm block" placeholder="Tất cả trạng thái">
                  <z-select-option value="">Tất cả trạng thái</z-select-option>
                  <z-select-option value="ACTIVE">Đang thực tập</z-select-option>
                  <z-select-option value="INACTIVE">Đã nghỉ</z-select-option>
                </z-select>
              </div>
            </div>

            <button z-button variant="default" type="submit" class="h-9 gap-2 shadow-sm" [zLoading]="loading()">
              @if(!loading()) {
                <ng-icon name="lucideSearch" size="16"></ng-icon>
              }
              Tìm kiếm
            </button>

            <div class="flex-1"></div>

            <button type="button" z-button variant="default" class="h-9 gap-2 shadow-sm">
              <ng-icon name="lucidePlus" size="16"></ng-icon>
              Thêm TTS
            </button>
          </form>

          <div class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden text-sm">
            <div class="overflow-x-auto w-full">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b bg-gray-50/50 dark:bg-gray-800/50">
                    <th class="py-2.5 px-4 font-medium text-gray-600 dark:text-gray-300">Account</th>
                    <th class="py-2.5 px-4 font-medium text-gray-600 dark:text-gray-300">Tổ chức</th>
                    <th class="py-2.5 px-4 font-medium text-gray-600 dark:text-gray-300">Công nghệ</th>
                    <th class="py-2.5 px-4 font-medium text-gray-600 dark:text-gray-300">Trạng thái</th>
                    <th class="py-2.5 px-4 font-medium text-gray-600 dark:text-gray-300 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of data()?.content" class="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td class="py-2 px-4">
                      <span class="font-medium text-primary hover:underline cursor-pointer">{{ item.companyAccount }}</span>
                    </td>
                    <td class="py-2 px-4">{{ item.organization }}</td>
                    <td class="py-2 px-4">{{ item.technology }}</td>
                    <td class="py-2 px-4">
                      <span class="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">{{ item.status }}</span>
                    </td>
                    <td class="py-2 px-4 text-right">
                      <button type="button" class="inline-flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full w-8 h-8 transition-colors focus:outline-none">
                        <ng-icon name="lucideTrash2" size="16"></ng-icon>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="!data()?.content?.length">
                    <td colspan="5" class="py-6 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </z-card>
    </div>
  `,
  styles: [`
    ::ng-deep .z-select-container button {
      height: 36px !important;
      padding-left: 36px !important;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
    }
  `]
})
export class InternListComponent implements OnInit {
  private useCase = inject(InternUseCase);
  private fb = inject(FormBuilder);

  data = signal<PageResponse<InternResponse> | null>(null);
  loading = signal(false);

  searchForm: FormGroup = this.fb.group({
    companyAccount: [''],
    status: ['']
  });

  ngOnInit() {
    this.loadData();
  }

  onSearch() {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    const request: InternSearchRequest = {
      ...this.searchForm.value,
      pageIndex: 0,
      pageSize: 10
    };

    // Clean empty values
    Object.keys(request).forEach(key => {
      if ((request as any)[key] === '') delete (request as any)[key];
    });

    this.useCase.searchInterns(request).subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: () => {
        // Fallback for demo since we might not have a real backend running
        console.error('Error fetching data');
        this.loading.set(false);
        this.data.set({
          content: [
            {
              id: '1',
              companyAccount: 'intern1.dev',
              organization: 'FPT Software',
              technology: 'Angular',
              status: 'ACTIVE',
              userId: 'u1',
              projectId: 'p1',
              internshipSessionId: 's1',
              graduated: false,
              mentorId: 'm1',
              gender: 'MALE',
              dateOfBirth: '2000-01-01',
              identityNumber: '123',
              identityIssueDate: '2020-01-01',
              level: 'FRESHER',
              major: 'IT',
              university: 'FPT',
              phone: '0123',
              permanentAddress: 'HN',
              position: 'Dev',
              internshipStartDate: '2023-01-01',
              internshipEndDate: '2023-06-01',
              acceptanceDocument: 'doc.pdf',
              createdAt: '2023-01-01',
              createdBy: 'Admin',
              updatedAt: '2023-01-01',
              updatedBy: 'Admin'
            }
          ],
          totalElements: 1,
          totalPages: 1,
          size: 10,
          number: 0
        });
      }
    });
  }
}
