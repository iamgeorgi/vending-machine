import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('ProductForm quantity validation', () => {
  it.each([0.5, -1, 16, NaN, Infinity])('rejects quantity %s without closing', (quantity) => {
    const close = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close } },
      ],
    });
    const component = TestBed.runInInjectionContext(() => new ProductForm());
    component.form.patchValue({ name: 'Water', price: 1.2, quantity });
    component.onSubmit();
    expect(component.form.controls.quantity.invalid).toBe(true);
    expect(close).not.toHaveBeenCalled();
  });

  it.each([0, 1, 15])('allows whole quantity %s', (quantity) => {
    const close = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close } },
      ],
    });
    const component = TestBed.runInInjectionContext(() => new ProductForm());
    component.form.patchValue({ name: 'Water', price: 1.2, quantity });
    component.onSubmit();
    expect(close).toHaveBeenCalledWith(expect.objectContaining({ quantity, price: 120 }));
  });
});