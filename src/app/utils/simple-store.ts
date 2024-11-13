import { computed, inject, signal, WritableSignal } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';

type Action<TState, P = void> = (state: TState, payload: P) => TState;
type ActionsBase = 'reset';

export type StoreConfig<TState, TActions> = {
  id: string;
  initialState: TState;
  actions: TActions;
  cacheFields?: Array<keyof TState>;
};

/**
 * Simple Store class
 *
 * @param id {string} unique id for the store
 * @param initialState {TState} initial state of the store
 * @param actions {TActions} actions of the store
 * @param cacheFields {Array<keyof TState>} fields to cache
 * @returns {SimpleStore<TState, TActions>}
 *
 * @example
 * const actions = {
 *   increment: (state: AppState) => ({ ...state, count: state.count + 1 }),
 *   decrement: (state: AppState) => ({ ...state, count: state.count - 1 }),
 *   incrementBy: (state: AppState, payload: number) => ({
 *     ...state,
 *     count: state.count + payload,
 *   }),
 *   setName: (state: AppState, payload: string) => ({
 *     ...state,
 *     details: {
 *       ...state.details,
 *       name: payload,
 *     },
 *   }),
 * };
 * const simpleStore = new SimpleStore<AppState, typeof actions>(
 *   'appState',
 *   initialState,
 *   actions,
 *   ['count', 'details']
 * );
 */
export class SimpleStore<
  TState,
  TActions extends Record<string, Action<TState, any>>
> {
  private id: string;
  private _state: WritableSignal<TState>;
  private initialState: TState;
  private actions: TActions;
  private cacheFields: Array<keyof TState>;
  private appConfig = inject(AppConfigService);

  constructor(storeConfig: StoreConfig<TState, TActions>) {
    this.id = storeConfig.id;
    this.initialState = storeConfig.initialState;
    this._state = signal(storeConfig.initialState);
    this.actions = storeConfig.actions;
    this.cacheFields = storeConfig.cacheFields || [];

    this.loadFromCache();
  }

  get state() {
    return this._state;
  }

  /**
   * select state from store by key name
   *
   * @param key {keyof TState}
   * @returns {TState[keyof TState]}
   *
   * @example
   * const name = simpleStore.select('name');
   */
  select<K extends keyof TState>(key: K) {
    return computed(() => this._state()[key])();
  }

  /**
   * dispatch action to store by type name and payload
   * if payload is undefined, it will be ignored
   * if type is reset, it will reset the store to initial state
   * it saves the state to cache
   *
   * @param type {keyof TActions | ActionsBase}
   * @param payload {Parameters<TActions[K]>[1]}
   * @returns void
   *
   * @example
   * simpleStore.dispatch('increment');
   * simpleStore.dispatch('decrement');
   * simpleStore.dispatch('incrementBy', 5);
   * simpleStore.dispatch('setName', 'nisan');
   * simpleStore.dispatch('reset');
   */
  dispatch<K extends keyof TActions | ActionsBase>(
    type: K,
    payload?: Parameters<TActions[K]>[1] extends undefined
      ? void
      : Parameters<TActions[K]>[1]
  ): void {
    if (type === 'reset') {
      this._state.set(this.initialState);
      this.saveToCache();
      return;
    }

    const action = this.actions[type];
    if (!action) {
      throw new Error(`Action type ${String(type)} not recognized`);
    }

    this._state.update((state) => action(state, payload));
    this.saveToCache();
  }

  /**
   * load state from cache
   */
  private loadFromCache() {
    const mainAppState = localStorage.getItem(
      this.appConfig.config.cacheAppStateName
    );
    if (mainAppState) {
      const parsedState = JSON.parse(mainAppState);
      if (parsedState[this.id]) {
        this._state.update((state) => ({
          ...state,
          ...parsedState[this.id],
        }));
      }
    }
  }

  /**
   * save state to cache
   */
  private saveToCache() {
    const { cacheAppStateName } = this.appConfig.config;
    const currentMainAppState = JSON.parse(
      localStorage.getItem(cacheAppStateName) || '{}'
    );
    const state = this._state();

    // Save the specific store section to main app state
    currentMainAppState[this.id] = this.cacheFields.reduce((acc, field) => {
      acc[field] = state[field];
      return acc;
    }, {} as Partial<TState>);

    localStorage.setItem(
      cacheAppStateName,
      JSON.stringify(currentMainAppState)
    );
  }
}
