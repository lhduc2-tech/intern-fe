import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InternUseCase } from '../../application/intern.usecase';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardSelectComponent, ZardSelectOptionComponent } from '@/shared/components/select';
import { ZardDatePickerComponent } from '@/shared/components/date-picker';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideSave, lucideEdit } from '@ng-icons/lucide';
import { ToastService } from '@/shared/components/toast';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'app-intern-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ZardButtonComponent,
    ZardCardComponent,
    ZardSelectComponent,
    ZardSelectOptionComponent,
    ZardDatePickerComponent,
    ZardInputDirective,
    NgIcon
  ],
  viewProviders: [provideIcons({ lucideArrowLeft, lucideSave, lucideEdit })],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div class="flex items-center gap-4">
        <a routerLink="/interns" z-button zType="outline" class="w-10 h-10 p-0 rounded-full flex items-center justify-center border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors shadow-sm">
          <ng-icon name="lucideArrowLeft" size="20"></ng-icon>
        </a>
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ viewMode() ? 'Chi tiết TTS' : (isEdit() ? 'Chỉnh sửa TTS' : 'Thêm mới TTS') }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ viewMode() ? 'Xem thông tin chi tiết của thực tập sinh.' : (isEdit() ? 'Cập nhật thông tin thực tập sinh trong hệ thống.' : 'Khai báo thông tin thực tập sinh mới.') }}
          </p>
        </div>
      </div>

      <z-card class="shadow-sm border-gray-200 dark:border-gray-800">
        <div class="p-6 sm:p-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Cột 1 -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 text-gray-800 dark:text-gray-200">Thông tin cơ bản</h3>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Họ và tên <span class="text-red-500">*</span></label>
                  <input z-input formControlName="fullName" placeholder="Nhập họ và tên" />
                </div>

                @if (id()) {
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">TK Công ty (Account)</label>
                    <input z-input formControlName="companyAccount" placeholder="Ví dụ: namnv" />
                  </div>
                }

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Tổ chức <span class="text-red-500">*</span></label>
                  <input z-input formControlName="organization" placeholder="Nhập tên tổ chức (VD: FPT Software, v.v.)" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Công nghệ <span class="text-red-500">*</span></label>
                  <input z-input formControlName="technology" placeholder="Nhập công nghệ (VD: Angular, Java, .NET...)" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Trạng thái <span class="text-red-500">*</span></label>
                  <z-select formControlName="status" class="w-full text-sm" placeholder="Chọn trạng thái">
                    <z-select-option value="ACTIVE">Đang thực tập</z-select-option>
                    <z-select-option value="INACTIVE">Đã nghỉ</z-select-option>
                  </z-select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Ngày sinh</label>
                  <z-date-picker formControlName="dateOfBirth" zFormat="dd/MM/yyyy" placeholder="Chọn ngày sinh" class="flex w-full [&>button]:w-full"></z-date-picker>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Số CCCD</label>
                    <input z-input formControlName="identityNumber" placeholder="Nhập số căn cước" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Ngày cấp CCCD</label>
                    <z-date-picker formControlName="identityIssueDate" zFormat="dd/MM/yyyy" placeholder="Chọn ngày cấp" class="flex w-full [&>button]:w-full [&>button]:min-w-0"></z-date-picker>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Giới tính</label>
                  <z-select formControlName="gender" class="w-full text-sm" placeholder="Chọn giới tính">
                    <z-select-option value="MALE">Nam</z-select-option>
                    <z-select-option value="FEMALE">Nữ</z-select-option>
                    <z-select-option value="OTHER">Khác</z-select-option>
                  </z-select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Địa chỉ thường trú</label>
                  <input z-input formControlName="permanentAddress" placeholder="Nhập địa chỉ thường trú" />
                </div>
              </div>

              <!-- Cột 2 -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 text-gray-800 dark:text-gray-200">Chi tiết thực tập</h3>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Đợt thực tập</label>
                  <z-select formControlName="internshipSessionId" class="w-full text-sm" placeholder="Chọn đợt thực tập">
                    @for (session of internshipSessions(); track session.id) {
                      <z-select-option [value]="session.id">{{ session.name }}</z-select-option>
                    }
                  </z-select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Chức danh / Vị trí</label>
                  <input z-input formControlName="position" placeholder="Vị trí thực tập" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Trình độ (Level)</label>
                  <z-select formControlName="level" class="w-full text-sm" placeholder="Chọn trình độ">
                    <z-select-option value="INTERN">Intern</z-select-option>
                    <z-select-option value="OJT">OJT</z-select-option>
                    <z-select-option value="FRESHER">Fresher</z-select-option>
                    <z-select-option value="JUNIOR">Junior</z-select-option>
                  </z-select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Chuyên ngành (Học vấn)</label>
                  <input z-input formControlName="major" placeholder="Chuyên ngành" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Trường Đại học</label>
                  <input z-input formControlName="university" placeholder="Trường ĐH" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Số điện thoại</label>
                  <input z-input formControlName="phone" placeholder="Số điện thoại cá nhân" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Ngày bắt đầu</label>
                    <z-date-picker formControlName="internshipStartDate" zFormat="dd/MM/yyyy" placeholder="Bắt đầu" class="flex w-full [&>button]:w-full [&>button]:min-w-0"></z-date-picker>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Ngày kết thúc</label>
                    <z-date-picker formControlName="internshipEndDate" zFormat="dd/MM/yyyy" placeholder="Kết thúc" class="flex w-full [&>button]:w-full [&>button]:min-w-0"></z-date-picker>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 focus-within:text-primary transition-colors">Số văn bản tiếp nhận</label>
                  <input z-input formControlName="acceptanceDocument" placeholder="Nhập số VBTN" />
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              @if (viewMode()) {
                <button type="button" z-button zType="default" (click)="enterEditMode()" class="shadow-sm gap-2">
                  <ng-icon name="lucideEdit" size="16"></ng-icon>
                  Chỉnh sửa
                </button>
              } @else {
                @if (isEdit()) {
                  <button type="button" z-button zType="outline" (click)="cancelEdit()" class="shadow-sm">
                    Hủy bỏ
                  </button>
                } @else {
                  <a routerLink="/interns" z-button zType="outline" class="shadow-sm">
                    Hủy bỏ
                  </a>
                }

                <button z-button type="submit" [zLoading]="submitting()" [disabled]="form.invalid" class="shadow-sm gap-2">
                  @if(!submitting()) {
                    <ng-icon name="lucideSave" size="16"></ng-icon>
                  }
                  Lưu lại
                </button>
              }
            </div>
          </form>
        </div>
      </z-card>
    </div>
  `,
  styles: [`
    ::ng-deep .z-select-container button,
    ::ng-deep z-select button {
      height: 36px !important;
    }
  `]
})
export class InternFormComponent implements OnInit {
  private useCase = inject(InternUseCase);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  id = signal<string | null>(null);
  isEdit = signal(false);
  viewMode = signal(false);
  originalData = signal<any>(null);
  submitting = signal(false);
  loading = signal(false);
  internshipSessions = signal<any[]>([]);

  form: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    companyAccount: [{value: '', disabled: true}],
    organization: ['', Validators.required],
    technology: ['', Validators.required],
    status: ['ACTIVE', Validators.required],
    level: [''],
    position: [''],
    major: [''],
    university: [''],
    gender: [''],
    dateOfBirth: [''],
    identityNumber: [''],
    identityIssueDate: [''],
    permanentAddress: [''],
    internshipSessionId: [''],
    acceptanceDocument: [''],
    phone: [''],
    internshipStartDate: [''],
    internshipEndDate: ['']
  });

  ngOnInit() {
    this.loadInternshipSessions();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(idParam);
      this.isEdit.set(true);
      this.viewMode.set(true);
      this.form.disable();
      this.loadData();
    }
  }

  loadInternshipSessions() {
    this.useCase.searchInternshipSessions({
      pageIndex: 0,
      pageSize: 1000,
      sort: 'createdAt',
      direction: 'DESC'
    }).subscribe({
      next: (res) => {
        this.internshipSessions.set(res.content || []);
      },
      error: () => console.error('Failed to load internship sessions')
    });
  }

  loadData() {
    const internId = this.id();
    if (!internId) return;

    this.loading.set(true);
    this.useCase.getIntern(internId).subscribe({
      next: (res) => {
        this.originalData.set(res);
        this.form.patchValue({
          ...res,
          fullName: res.fullName || '',
          dateOfBirth: res.dateOfBirth ? new Date(res.dateOfBirth) : null,
          identityIssueDate: res.identityIssueDate ? new Date(res.identityIssueDate) : null,
          internshipStartDate: res.internshipStartDate ? new Date(res.internshipStartDate) : null,
          internshipEndDate: res.internshipEndDate ? new Date(res.internshipEndDate) : null
        });
        this.loading.set(false);
      },
      error: () => {
        if (isPlatformBrowser(this.platformId)) {
          this.toast.error('Lỗi', 'Không thể tải dữ liệu thực tập sinh');
        }
        this.loading.set(false);
      }
    });
  }

  enterEditMode() {
    this.viewMode.set(false);
    this.form.enable();
    this.form.get('companyAccount')?.disable();
  }

  cancelEdit() {
    const orig = this.originalData() || {};
    this.form.patchValue({
      ...orig,
      fullName: orig.fullName || '',
      dateOfBirth: orig.dateOfBirth ? new Date(orig.dateOfBirth) : null,
      identityIssueDate: orig.identityIssueDate ? new Date(orig.identityIssueDate) : null,
      internshipStartDate: orig.internshipStartDate ? new Date(orig.internshipStartDate) : null,
      internshipEndDate: orig.internshipEndDate ? new Date(orig.internshipEndDate) : null
    });
    this.form.disable();
    this.viewMode.set(true);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const data = { ...this.form.value };

    // Xử lý transform Date object về chuỗi yyyy-MM-dd
    const formatDate = (date: any) => {
      if (!date) return null;
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    data.dateOfBirth = formatDate(data.dateOfBirth);
    data.identityIssueDate = formatDate(data.identityIssueDate);
    data.internshipStartDate = formatDate(data.internshipStartDate);
    data.internshipEndDate = formatDate(data.internshipEndDate);

    const req = this.isEdit() ? this.useCase.updateIntern(this.id()!, data) : this.useCase.createIntern(data);

    req.subscribe({
      next: () => {
        this.toast.success(
          'Thành công',
          this.isEdit() ? 'Đã cập nhật thông tin TTS' : 'Đã thêm TTS thành công'
        );
        this.submitting.set(false);
        this.router.navigate(['/interns']);
      },
      error: () => {
        this.toast.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
        this.submitting.set(false);
      }
    });
  }
}
