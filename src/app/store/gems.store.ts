import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { setError, setFulfilled, setPending, withRequestStatus } from './utils/request-status.feature';
import { Gem } from '../features/gems/gems.model';
import { BASE_API_URL } from '../infra/utils/constants';

type GemsState = {
  gems: Array<Gem>;
};

const initialState: GemsState = {
  gems: Array<Gem>(),
};

export const GemsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ gems }) => ({
    count: computed(() => gems.length || 0),
  })),
  withRequestStatus(),
  withMethods((store) => {
    const http = inject(HttpClient);

    return {
      async getGems() {
        try {
          console.log('[GemsStore] getGems');
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.get<Array<Gem>>(`${BASE_API_URL}/gems`));
          patchState(store, { gems });
          patchState(store, setFulfilled());
          return gems;
        } catch (error) {
          patchState(store, setError('[GemsStore] Failed to fetch gems'));
          console.error('[GemsStore] Failed to fetch gems', error);
          return [];
        }
      },
      async addGem(gem: Gem) {
        try {
          console.log('[GemsStore] addGem');
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.post<Array<Gem>>(`${BASE_API_URL}/gem`, gem));
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          patchState(store, setError('Failed to add gem'));
          console.error('[GemsStore] Failed to add gem', error);
        }
      },
      async updateGem(gem: Gem) {
        try {
          console.log('[GemsStore] updateGem');
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.put<Array<Gem>>(`${BASE_API_URL}/gems`, gem));
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          patchState(store, setError('Failed to update gem'));
          console.error('[GemsStore] Failed to update gem', error);
        }
      },
      async deleteGem(id: string) {
        try {
          console.log(`[GemsStore] deleteGem ${id}`);
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.delete<Array<Gem>>(`${BASE_API_URL}/gems/${id}`));
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          patchState(store, setError('Failed to delete gem'));
          console.error('[GemsStore] Failed to delete gem', error);
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      console.log('onInit');
    },
    onDestroy() {
      console.log('onDestroy');
    },
  })
);
