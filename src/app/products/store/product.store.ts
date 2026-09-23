import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Product, ProductFormValue } from '../../models/product.model';
import { inject } from '@angular/core';
import { ProductApiService } from '../../services/product-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, filter, pipe, switchMap, tap } from 'rxjs';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
};

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  loaded: false,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, productsApi = inject(ProductApiService)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        filter(() => !store.loaded() && !store.loading()),
        tap(() => {
          patchState(store, { loading: true, error: null });
        }),
        exhaustMap(() =>
          productsApi.getProducts().pipe(
            tapResponse({
              next: (products) => {
                patchState(store, { products, loading: false, loaded: true });
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
    saveProduct: (productValue: ProductFormValue, productId?: string) => {
      patchState(store, (state) => {
        if (productId) {
          return {
            products: state.products.map((product) =>
              product.id === productId ? { ...product, ...productValue } : product,
            ),
          };
        }

        const newProduct: Product = {
          ...productValue,
          id: crypto.randomUUID(),
        };

        return {
          products: [newProduct, ...state.products],
        };
      });
    },
    deleteProduct: (productId: string) => {
      patchState(store, (state) => ({
        products: state.products.filter((product) => product.id !== productId),
      }));
    },

    decreaseProductQuantity: (productId: string): boolean => {
      const currentProduct = store.products().find((product) => product.id === productId);
      if (!currentProduct || !Number.isSafeInteger(currentProduct.quantity) || currentProduct.quantity < 1) {
        return false;
      }
      patchState(store, (state) => ({
        products: state.products.map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        ),
      }));
      return true;
    },
  })),
);
