import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLogIn,
  lucideEye,
  lucideEyeOff,
  lucideMail,
  lucideLock,
  lucideLoader2,
} from '@ng-icons/lucide';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { AuthUseCase } from '../../application/auth.usecase';
import { ToastService } from '@/shared/components/toast';

@Component({
  selector: 'app-login',
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
      lucideLogIn,
      lucideEye,
      lucideEyeOff,
      lucideMail,
      lucideLock,
      lucideLoader2,
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
                <ng-icon name="lucideLogIn" class="logo-svg" />
              </div>
            </div>
            <h1 class="branding-title">Chào mừng trở lại</h1>
            <p class="branding-subtitle">
              Đăng nhập để truy cập vào hệ thống quản lý thực tập sinh
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
          <z-card class="auth-card" zTitle="Đăng nhập" zDescription="Nhập thông tin tài khoản để tiếp tục">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">

              <!-- Username / Email -->
              <div class="form-group">
                <label for="login-username" class="form-label">
                  <ng-icon name="lucideMail" class="label-icon" />
                  Tên đăng nhập hoặc Email
                </label>
                <input
                  z-input
                  id="login-username"
                  type="text"
                  formControlName="usernameOrEmail"
                  placeholder="Nhập tên đăng nhập hoặc email"
                  [zStatus]="getFieldStatus('usernameOrEmail')"
                />
                @if (isFieldInvalid('usernameOrEmail')) {
                  <p class="form-error">Vui lòng nhập tên đăng nhập hoặc email</p>
                }
              </div>

              <!-- Password -->
              <div class="form-group">
                <label for="login-password" class="form-label">
                  <ng-icon name="lucideLock" class="label-icon" />
                  Mật khẩu
                </label>
                <div class="password-wrapper">
                  <input
                    z-input
                    id="login-password"
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Nhập mật khẩu"
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
                  <p class="form-error">Vui lòng nhập mật khẩu</p>
                }
              </div>

              <!-- Error message -->
              @if (errorMessage()) {
                <div class="alert-error">
                  {{ errorMessage() }}
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
                  <ng-icon name="lucideLogIn" />
                }
                {{ isLoading() ? 'Đang đăng nhập...' : 'Đăng nhập' }}
              </button>
            </form>

            <div card-footer class="w-full">
              <div class="form-footer">
                <span class="footer-text">Chưa có tài khoản?</span>
                <a routerLink="/register" class="footer-link">Đăng ký ngay</a>
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
        oklch(0.28 0.12 260) 0%,
        oklch(0.22 0.15 280) 50%,
        oklch(0.18 0.1 300) 100%
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
    }

    @media (min-width: 1024px) {
      .auth-form-wrapper {
        max-width: 560px;
      }
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
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

    .space-y-5 > * + * {
      margin-top: 1.25rem;
    }
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authUseCase = inject(AuthUseCase);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly loginForm = this.fb.nonNullable.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getFieldStatus(field: string): 'error' | undefined {
    return this.isFieldInvalid(field) ? 'error' : undefined;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { usernameOrEmail, password } = this.loginForm.getRawValue();

    this.authUseCase.login({ usernameOrEmail, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Thành công', 'Đăng nhập thành công. Đang chuyển hướng...');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const errMessage = err?.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        this.toast.error('Lỗi', errMessage);
        this.errorMessage.set(errMessage);
      },
    });
  }
}
