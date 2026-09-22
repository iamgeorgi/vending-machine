import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Product, ProductFormValue } from '../../models/product.model';
import { computed, effect, inject } from '@angular/core';
import { ProductApiService } from '../../services/product-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';

type ProductState = {
  products: Product[];
  selectedProductId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  products: [],
  selectedProductId: null,
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
    saveProduct: (productValue: ProductFormValue) => {
      patchState(store, (state) => {
        const productId = state.selectedProductId;

        if (productId) {
          return {
            products: state.products.map((product) =>
              product.id === productId ? { ...product, ...productValue } : product,
            ),
            selectedProductId: null,
          };
        }

        const newProduct: Product = {
          ...productValue,
          id: crypto.randomUUID(),
        };

        return {
          products: [newProduct, ...state.products],
          selectedProductId: null,
        };
      });
    },
    deleteProduct: (productId: string) => {
      patchState(store, (state) => ({
        products: state.products.filter((product) => product.id !== productId),
      }));
    },
    selectedProductid: (productId: string) => {
      patchState(store, { selectedProductId: productId });
    },
  })),
  withComputed((state) => ({
    selectedProduct: computed(() => {
      return state.products().find((product) => product.id === state.selectedProductId()) || null;
    }),
  })),
);
