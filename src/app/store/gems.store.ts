import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { setError, setFulfilled, setPending, withRequestStatus } from './utils/request-status.feature';
import { Gem } from '../features/gems/gems.model';

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
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.get<Array<Gem>>('/api/gems'));
          patchState(store, { gems });
          patchState(store, setFulfilled());
          return gems;
        } catch (error) {
          patchState(store, setError('Failed to fetch gems'));
          console.error('Failed to fetch gems', error);
          return [];
        }
      },
      async addGem(gem: Gem) {
        try {
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.post<Array<Gem>>('/api/gems', gem));
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          patchState(store, setError('Failed to add gem'));
          console.error('Failed to add gem', error);
        }
      },
      async updateGem(gem: Gem) {
        try {
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.put<Array<Gem>>('/api/gems', gem));
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          patchState(store, setError('Failed to update gem'));
          console.error('Failed to update gem', error);
        }
      },
      async deleteGem(id: string) {
        try {
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.delete<Array<Gem>>(`/api/gems/${id}`));
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          patchState(store, setError('Failed to delete gem'));
          console.error('Failed to delete gem', error);
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.getGems();
    },
  })
);
