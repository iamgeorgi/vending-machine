import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product } from '../../models/product.model';
import { computed, inject } from '@angular/core';
import { ProductsStore } from '../../products/store/product.store';

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

export const ACCEPTED_COINS = [200, 100, 50, 20, 10, 5, 2, 1] as const;

export function calculateChange(amount: number): number[] | null {
  const result: number[] = [];

  let remaining = amount;

  for (const coin of ACCEPTED_COINS) {
    while (remaining >= coin) {
      result.push(coin);
      remaining -= coin;
    }
  }

  return remaining === 0 ? result : null;
}

export const VendingStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    insertedAmount: computed(() => store.insertedCoins().reduce((total, coin) => total + coin, 0)),
  })),

  withMethods((store, productsStore = inject(ProductsStore)) => ({
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
    buyProduct: (product: Product) => {
      if (product.quantity <= 0) {
        patchState(store, {
          error: 'Out of stock.',
        });
        return;
      }

      const inserted = store.insertedAmount();

      if (inserted < product.price) {
        patchState(store, {
          error: 'Insufficient funds.',
        });
        return;
      }

      const changeAmount = inserted - product.price;

      const change = calculateChange(changeAmount);

      if (!change) {
        patchState(store, {
          error: 'Unable to return exact change.',
        });

        return;
      }

      productsStore.decreaseProductQuantity(product.id);

      patchState(store, {
        insertedCoins: [],
        lastChange: change,
        error: null,
      });
    },
    reset: () => {
      patchState(store, {
        lastChange: store.insertedCoins(),
        insertedCoins: [],
        error: null,
      });
    },
  })),
);
