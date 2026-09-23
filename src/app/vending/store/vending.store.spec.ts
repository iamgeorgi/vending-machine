import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Product, ProductCategory } from '../../models/product.model';
import { ProductApiService } from '../../services/product-api.service';
import { ProductsStore } from '../../products/store/product.store';
import { ACCEPTED_COINS, calculateChange, VendingStore } from './vending.store';

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

  it('accepts all denominations and totals integer cents exactly', () => {
    vending.reset();
    for (const coin of ACCEPTED_COINS) vending.insertCoin(coin);
    expect(vending.insertedCoins()).toEqual([...ACCEPTED_COINS]);
    expect(vending.insertedAmount()).toBe(388);
  });

  it.each([0, -1, 3, 0.5, NaN, Infinity])('rejects unsupported coin %s without changing credit', coin => {
    vending.insertCoin(coin);
    expect(vending.insertedCoins()).toEqual([200]);
    expect(vending.insertedAmount()).toBe(200);
    expect(vending.error()).toBe('Unsupported coin denomination.');
  });

  it('supports repeated exact-payment purchases until stock is exhausted', () => {
    vending.reset();
    for (let i = 0; i < 2; i++) {
      vending.insertCoin(100);
      vending.insertCoin(20);
      vending.buyProduct(product.id);
      expect(vending.insertedCoins()).toEqual([]);
      expect(vending.lastChange()).toEqual([]);
      expect(vending.error()).toBeNull();
      expect(products.products()[0].quantity).toBe(1 - i);
    }
    vending.insertCoin(200);
    vending.buyProduct(product.id);
    expect(vending.error()).toBe('Out of stock.');
    expect(vending.insertedCoins()).toEqual([200]);
    expect(products.products()[0].quantity).toBe(0);
  });

  it('returns exact inserted coins on reset and clears errors without purchasing', () => {
    vending.insertCoin(20);
    vending.insertCoin(20);
    vending.buyProduct('missing');
    vending.reset();
    expect(vending.lastChange()).toEqual([200, 20, 20]);
    expect(vending.insertedAmount()).toBe(0);
    expect(vending.insertedCoins()).toEqual([]);
    expect(vending.error()).toBeNull();
    expect(products.products()[0].quantity).toBe(2);
    vending.reset();
    expect(vending.lastChange()).toEqual([]);
    expect(products.products()[0].quantity).toBe(2);
  });
  it('clears previous purchase change when starting another transaction', () => {
    vending.buyProduct(product.id);
    expect(vending.lastChange()).toEqual([50, 20, 10]);
    vending.insertCoin(100);
    expect(vending.lastChange()).toEqual([]);
    expect(vending.insertedCoins()).toEqual([100]);
    expect(products.products()[0].quantity).toBe(1);
  });

  it('clears the previous refund on the next accepted coin', () => {
    vending.insertCoin(20);
    vending.insertCoin(20);
    vending.reset();
    expect(vending.lastChange()).toEqual([200, 20, 20]);
    vending.insertCoin(50);
    expect(vending.lastChange()).toEqual([]);
    expect(vending.insertedCoins()).toEqual([50]);
    expect(products.products()[0].quantity).toBe(2);
  });

  it('preserves returned coins for rejected coins and clears the error on valid insertion', () => {
    vending.reset();
    vending.insertCoin(3);
    expect(vending.lastChange()).toEqual([200]);
    expect(vending.insertedCoins()).toEqual([]);
    expect(vending.error()).toBe('Unsupported coin denomination.');
    vending.insertCoin(10);
    expect(vending.lastChange()).toEqual([]);
    expect(vending.error()).toBeNull();
    expect(vending.insertedAmount()).toBe(10);
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

describe('calculateChange', () => {
  it.each([0, 1, 9, 75, 199, 388, 999])('returns exactly %s cents using accepted denominations', amount => {
    const change = calculateChange(amount)!;
    expect(change.reduce((sum, coin) => sum + coin, 0)).toBe(amount);
    expect(change.every(coin => (ACCEPTED_COINS as readonly number[]).includes(coin))).toBe(true);
  });

  it('rejects a fractional-cent remainder', () => {
    expect(calculateChange(75.5)).toBeNull();
  });
});