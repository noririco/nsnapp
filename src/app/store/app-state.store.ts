import { StoreConfig } from '../utils/simple-store';

export interface AppState {
  count: number;
  details: {
    name: string;
    age: number;
    address: string[];
  };
}
export type AppStateActions = typeof actions;

const id = 'appState';

const initialState: AppState = {
  count: 0,
  details: {
    name: 'bezan',
    age: 25,
    address: ['Harvard Singdal New York', 'Oxford University London'],
  },
};

const actions = {
  increment: (state: AppState) => ({ ...state, count: state.count + 1 }),
  decrement: (state: AppState) => ({ ...state, count: state.count - 1 }),
  incrementBy: (state: AppState, payload: number) => ({
    ...state,
    count: state.count + payload,
  }),
  setName: (state: AppState, payload: string) => ({
    ...state,
    details: {
      ...state.details,
      name: payload,
    },
  }),
};

export const appStateConfig: StoreConfig<AppState, AppStateActions> = {
  id,
  initialState,
  actions,
  cacheFields: ['count', 'details'],
};
