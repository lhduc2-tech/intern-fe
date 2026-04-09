import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideUserPlus,
  lucideEye,
  lucideEyeOff,
  lucideMail,
  lucideLock,
  lucideUser,
  lucideIdCard,
  lucideBriefcase,
  lucideLoader2,
  lucideCheck,
} from '@ng-icons/lucide';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { AuthUseCase } from '../../application/auth.usecase';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    ZardButtonComponent,
    ZardInputDirective,
    ZardCardComponent,
  ],
  viewProviders: [
    provideIcons({
      lucideUserPlus,
      lucideEye,
      lucideEyeOff,
      lucideMail,
      lucideLock,
      lucideUser,
      lucideIdCard,
      lucideBriefcase,
      lucideLoader2,
      lucideCheck,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <!-- Left side - Branding -->
        <div class="auth-branding">
          <div class="branding-content">
            <div class="logo-wrapper">
              <div class="logo-icon">
                <ng-icon name="lucideUserPlus" class="logo-svg" />
              </div>
            </div>
            <h1 class="branding-title">Tạo tài khoản mới</h1>
            <p class="branding-subtitle">
              Đăng ký để bắt đầu sử dụng hệ thống quản lý thực tập sinh
            </p>
            <div class="branding-decoration">
              <div class="decoration-circle decoration-circle--1"></div>
              <div class="decoration-circle decoration-circle--2"></div>
              <div class="decoration-circle decoration-circle--3"></div>
            </div>
          </div>
        </div>

        <!-- Right side - Form -->
        <div class="auth-form-wrapper">
          <z-card class="auth-card" zTitle="Đăng ký tài khoản" zDescription="Điền thông tin bên dưới để tạo tài khoản mới">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">

              <!-- Full name -->
              <div class="form-group">
                <label for="reg-fullname" class="form-label">
                  <ng-icon name="lucideIdCard" class="label-icon" />
                  Họ và tên
                </label>
                <input
                  z-input
                  id="reg-fullname"
                  type="text"
                  formControlName="fullName"
                  placeholder="Nhập họ và tên"
                  [zStatus]="getFieldStatus('fullName')"
                />
                @if (isFieldInvalid('fullName')) {
                  <p class="form-error">
                    @if (registerForm.get('fullName')?.errors?.['required']) {
                      Vui lòng nhập họ và tên
                    } @else if (registerForm.get('fullName')?.errors?.['maxlength']) {
                      Họ và tên không được vượt quá 255 ký tự
                    }
                  </p>
                }
              </div>

              <!-- Username -->
              <div class="form-group">
                <label for="reg-username" class="form-label">
                  <ng-icon name="lucideUser" class="label-icon" />
                  Tên đăng nhập
                </label>
                <input
                  z-input
                  id="reg-username"
                  type="text"
                  formControlName="username"
                  placeholder="Nhập tên đăng nhập"
                  [zStatus]="getFieldStatus('username')"
                />
                @if (isFieldInvalid('username')) {
                  <p class="form-error">
                    @if (registerForm.get('username')?.errors?.['required']) {
                      Vui lòng nhập tên đăng nhập
                    } @else if (registerForm.get('username')?.errors?.['minlength']) {
                      Tên đăng nhập phải có ít nhất 3 ký tự
                    } @else if (registerForm.get('username')?.errors?.['maxlength']) {
                      Tên đăng nhập không được vượt quá 50 ký tự
                    }
                  </p>
                }
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="reg-email" class="form-label">
                  <ng-icon name="lucideMail" class="label-icon" />
                  Email
                </label>
                <input
                  z-input
                  id="reg-email"
                  type="email"
                  formControlName="email"
                  placeholder="Nhập địa chỉ email"
                  [zStatus]="getFieldStatus('email')"
                />
                @if (isFieldInvalid('email')) {
                  <p class="form-error">
                    @if (registerForm.get('email')?.errors?.['required']) {
                      Vui lòng nhập email
                    } @else if (registerForm.get('email')?.errors?.['email']) {
                      Email không hợp lệ
                    }
                  </p>
                }
              </div>

              <!-- Role -->
              <div class="form-group">
                <label for="reg-role" class="form-label">
                  <ng-icon name="lucideBriefcase" class="label-icon" />
                  Vai trò
                </label>
                <select
                  id="reg-role"
                  formControlName="role"
                  class="form-select"
                  [class.form-select--error]="isFieldInvalid('role')"
                >
                  <option value="" disabled>Chọn vai trò</option>
                  <option value="INTERN">Thực tập sinh</option>
                  <option value="MENTOR">Người hướng dẫn</option>
                  <option value="MANAGER">Quản lý</option>
                </select>
                @if (isFieldInvalid('role')) {
                  <p class="form-error">Vui lòng chọn vai trò</p>
                }
              </div>

              <!-- Password -->
              <div class="form-group">
                <label for="reg-password" class="form-label">
                  <ng-icon name="lucideLock" class="label-icon" />
                  Mật khẩu
                </label>
                <div class="password-wrapper">
                  <input
                    z-input
                    id="reg-password"
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                    [zStatus]="getFieldStatus('password')"
                    class="pr-10"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    (click)="togglePassword()"
                    tabindex="-1"
                  >
                    <ng-icon [name]="showPassword() ? 'lucideEyeOff' : 'lucideEye'" />
                  </button>
                </div>
                @if (isFieldInvalid('password')) {
                  <p class="form-error">
                    @if (registerForm.get('password')?.errors?.['required']) {
                      Vui lòng nhập mật khẩu
                    } @else if (registerForm.get('password')?.errors?.['minlength']) {
                      Mật khẩu phải có ít nhất 6 ký tự
                    } @else if (registerForm.get('password')?.errors?.['maxlength']) {
                      Mật khẩu không được vượt quá 256 ký tự
                    }
                  </p>
                }
              </div>

              <!-- Confirm password -->
              <div class="form-group">
                <label for="reg-confirm-password" class="form-label">
                  <ng-icon name="lucideLock" class="label-icon" />
                  Xác nhận mật khẩu
                </label>
                <div class="password-wrapper">
                  <input
                    z-input
                    id="reg-confirm-password"
                    [type]="showConfirmPassword() ? 'text' : 'password'"
                    formControlName="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    [zStatus]="getFieldStatus('confirmPassword')"
                    class="pr-10"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    (click)="toggleConfirmPassword()"
                    tabindex="-1"
                  >
                    <ng-icon [name]="showConfirmPassword() ? 'lucideEyeOff' : 'lucideEye'" />
                  </button>
                </div>
                @if (isFieldInvalid('confirmPassword')) {
                  <p class="form-error">
                    @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                      Vui lòng xác nhận mật khẩu
                    } @else if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                      Mật khẩu xác nhận không khớp
                    }
                  </p>
                }
              </div>

              <!-- Error / Success messages -->
              @if (errorMessage()) {
                <div class="alert-error">
                  {{ errorMessage() }}
                </div>
              }
              @if (successMessage()) {
                <div class="alert-success">
                  {{ successMessage() }}
                </div>
              }

              <!-- Submit -->
              <button
                z-button
                type="submit"
                zSize="lg"
                zFull
                [zLoading]="isLoading()"
                [zDisabled]="isLoading()"
                class="submit-btn"
              >
                @if (!isLoading()) {
                  <ng-icon name="lucideUserPlus" />
                }
                {{ isLoading() ? 'Đang xử lý...' : 'Đăng ký' }}
              </button>
            </form>

            <div card-footer class="w-full">
              <div class="form-footer">
                <span class="footer-text">Đã có tài khoản?</span>
                <a routerLink="/login" class="footer-link">Đăng nhập</a>
              </div>
            </div>
          </z-card>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100dvh;
    }

    .auth-page {
      min-height: 100dvh;
      display: flex;
      align-items: stretch;
      background: var(--background);
    }

    .auth-container {
      display: flex;
      width: 100%;
      min-height: 100dvh;
    }

    /* ---- Branding Side ---- */
    .auth-branding {
      display: none;
      flex: 1;
      background: linear-gradient(135deg,
        oklch(0.35 0.15 155) 0%,
        oklch(0.28 0.12 175) 50%,
        oklch(0.22 0.1 195) 100%
      );
      position: relative;
      overflow: hidden;
      padding: 3rem;
      align-items: center;
      justify-content: center;
    }

    @media (min-width: 1024px) {
      .auth-branding {
        display: flex;
      }
    }

    .branding-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 420px;
    }

    .logo-wrapper {
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;
    }

    .logo-icon {
      width: 80px;
      height: 80px;
      border-radius: 1.25rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .logo-svg {
      font-size: 2rem;
      color: white;
    }

    .branding-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.2;
      letter-spacing: -0.025em;
    }

    .branding-subtitle {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .branding-features {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      text-align: left;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.9375rem;
    }

    .feature-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-icon ng-icon {
      font-size: 0.875rem;
    }

    .branding-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.08;
    }

    .decoration-circle--1 {
      width: 400px;
      height: 400px;
      background: white;
      top: -100px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }

    .decoration-circle--2 {
      width: 300px;
      height: 300px;
      background: white;
      bottom: -80px;
      left: -80px;
      animation: float 10s ease-in-out infinite reverse;
    }

    .decoration-circle--3 {
      width: 200px;
      height: 200px;
      background: white;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: float 12s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(15px, -20px) scale(1.05); }
      66% { transform: translate(-10px, 15px) scale(0.95); }
    }

    /* ---- Form Side ---- */
    .auth-form-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      max-width: 100%;
      overflow-y: auto;
    }

    @media (min-width: 1024px) {
      .auth-form-wrapper {
        max-width: 560px;
      }
    }

    .auth-card {
      width: 100%;
      max-width: 460px;
      border: none;
      box-shadow: none;
      background: transparent;
    }

    @media (max-width: 1023px) {
      .auth-card {
        background: var(--card);
        border: 1px solid var(--border);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
    }

    /* ---- Form Styles ---- */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--foreground);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .label-icon {
      font-size: 0.875rem;
      color: var(--muted-foreground);
    }

    .form-select {
      width: 100%;
      height: 2.25rem;
      padding: 0 0.625rem;
      border-radius: 0.5rem;
      border: 1px solid var(--input);
      background: transparent;
      color: var(--foreground);
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.625rem center;
      padding-right: 2.25rem;
    }

    .form-select:focus {
      border-color: var(--ring);
      box-shadow: 0 0 0 3px oklch(0.708 0 0 / 0.5);
    }

    .form-select--error {
      border-color: var(--destructive);
    }

    .form-select--error:focus {
      box-shadow: 0 0 0 3px oklch(0.577 0.245 27.325 / 0.2);
    }

    .password-wrapper {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.625rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--muted-foreground);
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }

    .password-toggle:hover {
      color: var(--foreground);
    }

    .form-error {
      font-size: 0.8rem;
      color: var(--destructive);
      margin: 0;
    }

    .alert-error {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: oklch(0.577 0.245 27.325 / 0.1);
      color: var(--destructive);
      font-size: 0.875rem;
      border: 1px solid oklch(0.577 0.245 27.325 / 0.2);
    }

    .alert-success {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: oklch(0.55 0.15 145 / 0.1);
      color: oklch(0.45 0.15 145);
      font-size: 0.875rem;
      border: 1px solid oklch(0.55 0.15 145 / 0.2);
    }

    .submit-btn {
      margin-top: 0.5rem;
      font-size: 0.9375rem !important;
      height: 2.75rem !important;
    }

    .form-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.375rem;
      padding-top: 0.5rem;
    }

    .footer-text {
      font-size: 0.875rem;
      color: var(--muted-foreground);
    }

    .footer-link {
      font-size: 0.875rem;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    .footer-link:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    .space-y-4 > * + * {
      margin-top: 1rem;
    }
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authUseCase = inject(AuthUseCase);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly registerForm = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.maxLength(255)]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(256),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getFieldStatus(field: string): 'error' | undefined {
    return this.isFieldInvalid(field) ? 'error' : undefined;
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { username, email, fullName, role, password } =
      this.registerForm.getRawValue();

    this.authUseCase
      .register({ username, email, fullName, role, password })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set(
            'Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...',
          );
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err?.error?.message ||
            'Đăng ký thất bại. Vui lòng thử lại.',
          );
        },
      });
  }
}
