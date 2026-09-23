import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../app.routes';
import { ProductsStore } from '../../../products/store/product.store';
import { ProductCategory } from '../../../models/product.model';
import { VendingMachine } from './vending-machine';

describe('Vending navigation and inventory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('shares local CRUD and purchases across routes without reloading inventory', async () => {
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', VendingMachine);
    http.expectOne('http://localhost:3000/products').flush([
      { id: '1', name: 'Water', category: ProductCategory.Beverage, price: 120, quantity: 1 },
    ]);
    harness.detectChanges();
    const store = TestBed.inject(ProductsStore);
    await harness.navigateByUrl('/products');
    store.saveProduct({ name: 'Edited water', category: ProductCategory.Beverage, price: 150, quantity: 1 }, '1');
    store.saveProduct({ name: 'Candy', category: ProductCategory.Candy, price: 50, quantity: 2 });
    await harness.navigateByUrl('/', VendingMachine);
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Edited water');
    expect(harness.routeNativeElement?.textContent).toContain('Candy');
    const view = harness.routeNativeElement!;
    (view.querySelector('.coin-selector button') as HTMLButtonElement).click();
    const water = Array.from(view.querySelectorAll('app-vending-product-card'))
      .find(card => card.textContent?.includes('Edited water'))!;
    (water.querySelector('button') as HTMLButtonElement).click();
    harness.detectChanges();
    expect(store.products().find(p => p.id === '1')?.quantity).toBe(0);
    expect(water.textContent).toContain('Out of stock');
    await harness.navigateByUrl('/products');
    expect(store.products().find(p => p.id === '1')?.quantity).toBe(0);
    for (const product of store.products()) store.deleteProduct(product.id);
    await harness.navigateByUrl('/', VendingMachine);
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('No products yet');
    http.expectNone('http://localhost:3000/products');
    http.verify();
  });

  it('does not restart an initial request when navigating before it completes', async () => {
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const request = http.expectOne('http://localhost:3000/products');
    await harness.navigateByUrl('/products');
    expect(request.cancelled).toBe(false);
    http.expectNone('http://localhost:3000/products');
    request.flush([]);
    await harness.navigateByUrl('/');
    expect(TestBed.inject(ProductsStore).loaded()).toBe(true);
    http.verify();
  });
});