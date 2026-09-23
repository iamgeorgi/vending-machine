import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

type VendingState = {
  insertedCoins: number[];
  lastChange: number[];
  error: string | null;
};

const initialState: VendingState = {
  insertedCoins: [],
  lastChange: [],
  error: null,
};

export const ACCEPTED_COINS = [200, 100, 50, 20, 10] as const;

export const VendingStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    insertCoin: (coin: number) => {
      if (!ACCEPTED_COINS.includes(coin as any)) {
        patchState(store, {
          error: 'Unsupported coin denomination.',
        });

        return;
      }

      patchState(store, {
        insertedCoins: [...store.insertedCoins(), coin],
        error: null,
      });
    },
  })),
  withComputed((store) => ({
    insertedAmount: () => store.insertedCoins().reduce((total, coin) => total + coin, 0),
  })),
);
