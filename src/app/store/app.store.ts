import { computed, effect } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

type AppState = {
  version: string;
};

const initialState: AppState = {
  version: '0.0.1',
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ version }) => ({
    versionPatch: computed(() => version().split('.')[2]),
  })),
  withMethods((store) => ({
    changeVersion(version: string) {
      patchState(store, {
        version,
      });
    },
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        const state = getState(store);
        localStorage.setItem('AppStore', JSON.stringify(state));
      });

      const loadedState = JSON.parse(localStorage.getItem('AppStore') || '[]');
      patchState(store, loadedState);
    },
    onDestroy() {
      console.log('AppStore onDestroy');
    },
  })
);
