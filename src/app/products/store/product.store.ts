import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../../models/product.model';
import { inject } from '@angular/core';
import { ProductApiService } from '../../services/product-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, productsApi = inject(ProductApiService)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { loading: true, error: null });
        }),
        switchMap(() =>
          productsApi.getProducts().pipe(
            tapResponse({
              next: (products) => {
                patchState(store, { products, loading: false });
              },
              error: (error: unknown) => {
                patchState(store, {
                  error: error instanceof Error ? error.message : 'Failed to load products.',
                  loading: false,
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
