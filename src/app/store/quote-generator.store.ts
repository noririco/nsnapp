import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

type Quote = string;

type QuoteGeneratorState = {
  quotes: Quote[];
  randomQuote: Quote;
};

const initialState: QuoteGeneratorState = {
  quotes: [],
  randomQuote: 'initial quote',
};

export const QuoteGeneratorStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ quotes }) => ({
    count: computed(() => quotes().length || 0),
  })),
  withMethods((store) => {
    const http = inject(HttpClient);

    return {
      async generateQuote() {
        try {
          console.log('Generating quote...');
          const quotes = await firstValueFrom(http.post<string[]>('/api/openai/completions', {}));
          patchState(store, { quotes });
        } catch (error) {
          console.error('Failed to fetch quote', error);
        }
      },
      getRandomQuote() {
        const quotes = store.quotes();
        patchState(store, { randomQuote: quotes[Math.floor(Math.random() * quotes.length)] });
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.generateQuote();
    },
  })
);
