import { inject } from '@angular/core';
import { GemsStore } from '../../store/gems.store';
import { ResolveFn } from '@angular/router';
import { Gem } from './gems.model';

export const gemsResolveFn: ResolveFn<Gem[]> = (route, state) => {
  console.log(`[gemsResolveFn] Resolving gems`);
  const gemsStore = inject(GemsStore);
  return gemsStore.getGems();
};
