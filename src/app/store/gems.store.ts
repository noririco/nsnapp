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

      /**
       * Adds a gem optimistically, appending it to the store immediately.
       * If the API call fails, restores the previous gems state.
       * Maintains order by appending to the end.
       * @param gem The gem to add
       */
      async addGem(gem: Gem) {
        console.log('[GemsStore] addGem');
        // 1. Store the current state for potential rollback
        const previousGems = store.gems();

        // 2. Optimistically update the state immediately
        patchState(store, setPending());
        patchState(store, {
          gems: [...previousGems, gem],
        });

        try {
          // 3. Make the API call
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.post<Array<Gem>>(`${BASE_API_URL}/gems`, gem));

          // 4. Update with actual server response
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          // 5. Rollback to previous state on failure
          patchState(store, { gems: previousGems });
          patchState(store, setError('Failed to add gem'));
          console.error('[GemsStore] Failed to add gem', error);
        }
      },

      /**
       * Updates a gem optimistically, replacing it in the store immediately.
       * If the API call fails, restores the gem to its previous state.
       * Maintains original position in the list.
       * @param gem The gem with updated values
       */
      async updateGem(gem: Gem) {
        console.log('[GemsStore] updateGem');

        // 1. Store the current state and find the original gem for rollback
        const currentGems = store.gems();
        const originalGemIndex = currentGems.findIndex((g) => g._id === gem._id);
        if (originalGemIndex === -1) return; // Gem not found
        const originalGem = currentGems[originalGemIndex];

        // 2. Optimistically update the state immediately
        patchState(store, setPending());
        patchState(store, (state) => {
          const newGems = [...state.gems];
          newGems[originalGemIndex] = gem;
          return { gems: newGems };
        });

        try {
          // 3. Make the API call
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.put<Array<Gem>>(`${BASE_API_URL}/gems`, gem));

          // 4. Update with actual server response
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          // 5. Rollback to previous state for this specific gem
          patchState(store, (state) => {
            const newGems = [...state.gems];
            newGems[originalGemIndex] = originalGem;
            return {
              gems: newGems,
            };
          });
          patchState(store, setError('Failed to update gem'));
          console.error('[GemsStore] Failed to update gem', error);
        }
      },

      /**
       * Deletes a gem optimistically, removing it from the store immediately.
       * If the API call fails, restores the gem to its original position.
       * Handles concurrent deletes while maintaining original order.
       * @param id The ID of the gem to delete
       */
      async deleteGem(id: string) {
        console.log(`[GemsStore] deleteGem ${id}`);

        // Capture the current gems array to get both the gem and its index
        const currentGems = store.gems();
        const gemIndex = currentGems.findIndex((gem) => gem._id === id);
        const gemToDelete = currentGems[gemIndex];

        if (gemIndex === -1) return; // Gem not found

        const previousGems = store.gems();
        const gemsFiltered = previousGems.filter((gem) => gem._id !== id);
        patchState(store, { gems: gemsFiltered });
        patchState(store, setPending());
        try {
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const gems = await firstValueFrom(http.delete<Array<Gem>>(`${BASE_API_URL}/gems/${id}`));
          patchState(store, { gems });
          patchState(store, setFulfilled());
        } catch (error) {
          // Failure: restore only the specific gem that failed
          patchState(store, (state) => {
            // Check if gem is already restored
            const currentGemsState = state.gems;
            const alreadyRestored = currentGemsState.some((g) => g._id === id);

            if (alreadyRestored) {
              return state;
            }

            // Insert gem back at its original index
            const newGems = [...currentGemsState];
            newGems.splice(gemIndex, 0, gemToDelete);

            return {
              gems: newGems,
            };
          });
          patchState(store, setError('Failed to delete gem'));
          console.error('[GemsStore] Failed to delete gem', error);
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      console.log('[GemsStore] onInit');
    },
    onDestroy() {
      console.log('[GemsStore] onDestroy');
    },
  })
);
