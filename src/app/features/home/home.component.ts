import { Component, inject } from '@angular/core';
import { AppState, AppStateActions, appStateConfig } from '../../store/app-state.store';
import { AuthStore } from '../../store/auth.store';
import { SimpleStore } from '../../utils/simple-store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  simpleStore = new SimpleStore<AppState, AppStateActions>(appStateConfig);
  authStore = inject(AuthStore);
}
