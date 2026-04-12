import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/presentation/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/presentation/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'interns',
        loadComponent: () =>
          import('./features/intern/presentation/intern-list/intern-list.component').then(
            (m) => m.InternListComponent,
          ),
      },
      {
        path: 'interns/new',
        loadComponent: () =>
          import('./features/intern/presentation/intern-form/intern-form.component').then(
            (m) => m.InternFormComponent,
          ),
      },
      {
        path: 'interns/:id',
        loadComponent: () =>
          import('./features/intern/presentation/intern-form/intern-form.component').then(
            (m) => m.InternFormComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
