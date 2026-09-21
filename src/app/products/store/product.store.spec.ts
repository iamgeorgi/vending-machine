import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductApiService } from '../../services/product-api.service';
import { ProductsStore } from './product.store';

describe('ProductsStore', () => {
  it('can load products again after a failed request', () => {
    const firstRequest = new Subject<Product[]>();
    const secondRequest = new Subject<Product[]>();
    const getProducts = vi.fn()
      .mockReturnValueOnce(firstRequest)
      .mockReturnValueOnce(secondRequest);

    TestBed.configureTestingModule({
      providers: [{ provide: ProductApiService, useValue: { getProducts } }],
    });
    const store = TestBed.inject(ProductsStore);

    store.loadProducts();
    expect(store.loading()).toBe(true);
    firstRequest.error(new Error('Network unavailable'));
    expect(store.error()).toBe('Network unavailable');
    expect(store.loading()).toBe(false);

    store.loadProducts();
    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(store.loading()).toBe(true);
    expect(store.error()).toBeNull();

    const products: Product[] = [
      { id: '1', name: 'Water', category: 'beverage', price: 120, quantity: 5 },
    ];
    secondRequest.next(products);
    secondRequest.complete();
    expect(store.products()).toEqual(products);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });
});
