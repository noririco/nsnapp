import { QuoteGeneratorStore } from './../../store/quote-generator.store';
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { LoaderComponent } from './loader.component';
import { LoaderV2Component } from './loader-v2.component';
import { LoaderV3Component } from './loader-v3.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgIf, RouterLink, RouterOutlet, RouterLinkActive, LoaderComponent, LoaderV2Component, LoaderV3Component],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  // Initialize quotes in store as soon as the app loads.
  quoteGeneratorStore = inject(QuoteGeneratorStore);
  authStore = inject(AuthStore);
  router = inject(Router);
  loading = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading = false;
      }
    });
  }
}
