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
        path: '',
        pathMatch: 'full', // Default route inside authenticated layout
        redirectTo: 'home', // Redirect to home for authenticated users
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'gems',
        loadComponent: () => import('./features/gems/gems.component').then((m) => m.GemsComponent),
        resolve: { data: gemsResolveFn },
      },
      {
        path: 'd3pg',
        loadComponent: () => import('./features/d3pg/d3pg.component').then((m) => m.D3pgComponent),
      },
      // {
      //   path: 'about',
      //   loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      // },
    ],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
