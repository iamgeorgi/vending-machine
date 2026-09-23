import { signal } from '@angular/core';
import { ProductsStore } from '../../store/product.store';
import { Product } from '../../../models/product.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductManagement } from './product-management';

describe('ProductManagement', () => {
  let component: ProductManagement;
  let fixture: ComponentFixture<ProductManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagement],
      providers: [
        {
          provide: ProductsStore,
          useValue: {
            products: signal<Product[]>([]),
            loading: signal(false),
            loaded: signal(true),
            error: signal<string | null>(null),
            loadProducts: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(TestBed.inject(ProductsStore).loadProducts).toHaveBeenCalledTimes(1);
  });
});
