import { Routes } from '@angular/router';
import { authRoutes } from './infra/auth/auth.routes';
import { authGuard } from './infra/auth/guards/auth.guard';
import { LayoutComponent } from './infra/layout/layout.component';
import { gemsResolveFn } from './features/gems/gems.resolver';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // Guard applied to the layout, affecting child routes
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'gems',
        loadComponent: () => import('./features/gems/gems.component').then((m) => m.GemsComponent),
        resolve: { data: gemsResolveFn },
      },
      // {
      //   path: 'about',
      //   loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      // },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
