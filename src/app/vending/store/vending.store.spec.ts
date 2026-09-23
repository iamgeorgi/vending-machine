import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Product, ProductCategory } from '../../models/product.model';
import { ProductApiService } from '../../services/product-api.service';
import { ProductsStore } from '../../products/store/product.store';
import { VendingStore } from './vending.store';

describe('VendingStore purchase', () => {
  let products: InstanceType<typeof ProductsStore>;
  let vending: InstanceType<typeof VendingStore>;
  const product: Product = {
    id: '1', name: 'Water', category: ProductCategory.Beverage, price: 120, quantity: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ProductApiService, useValue: { getProducts: () => of([{ ...product }]) } }],
    });
    products = TestBed.inject(ProductsStore);
    vending = TestBed.inject(VendingStore);
    products.loadProducts();
    vending.insertCoin(200);
  });

  it('preserves payment when the product has been deleted', () => {
    products.deleteProduct(product.id);
    vending.buyProduct(product.id);
    expect(vending.insertedCoins()).toEqual([200]);
    expect(vending.error()).toBe('Product is no longer available.');
    expect(products.products()).toEqual([]);
  });

  it('checks the current price after an edit', () => {
    products.saveProduct({ ...product, price: 250 }, product.id);
    vending.buyProduct(product.id);
    expect(vending.error()).toBe('Insufficient funds.');
    expect(vending.insertedAmount()).toBe(200);
    expect(products.products()[0].quantity).toBe(2);
  });

  it('calculates change from the current price', () => {
    products.saveProduct({ ...product, price: 150 }, product.id);
    vending.buyProduct(product.id);
    expect(vending.lastChange()).toEqual([50]);
    expect(vending.insertedCoins()).toEqual([]);
    expect(products.products()[0].quantity).toBe(1);
  });

  it('checks current stock after an edit', () => {
    products.saveProduct({ ...product, quantity: 0 }, product.id);
    vending.buyProduct(product.id);
    expect(vending.error()).toBe('Out of stock.');
    expect(vending.insertedCoins()).toEqual([200]);
    expect(products.products()[0].quantity).toBe(0);
  });

  it('does not dispense twice for repeated calls without new payment', () => {
    vending.buyProduct(product.id);
    vending.buyProduct(product.id);
    expect(products.products()[0].quantity).toBe(1);
    expect(vending.insertedCoins()).toEqual([]);
    expect(vending.error()).toBe('Insufficient funds.');
  });

  it('preserves payment if inventory refuses the decrement', () => {
    vi.spyOn(products, 'decreaseProductQuantity').mockReturnValue(false);
    vending.buyProduct(product.id);
    expect(vending.insertedCoins()).toEqual([200]);
    expect(vending.lastChange()).toEqual([]);
    expect(vending.error()).toBe('Product is no longer available.');
  });

  it('reports failed inventory decrements', () => {
    expect(products.decreaseProductQuantity('missing')).toBe(false);
    products.saveProduct({ ...product, quantity: 0 }, product.id);
    expect(products.decreaseProductQuantity(product.id)).toBe(false);
    expect(products.products()[0].quantity).toBe(0);
  });
});
