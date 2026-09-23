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

  it.each([
    ['name', '   ', 'Product name is required.'],
    ['name', 'x'.repeat(101), 'Product name cannot exceed 100 characters.'],
    ['price', null, 'Price is required.'],
    ['price', 0, 'Price must be at least'],
    ['price', 1.234, 'Price must have no more than two decimal places.'],
    ['price', 1e20, 'Price must convert to a safe integer'],
    ['price', Infinity, 'Price must convert to a safe integer'],
  ])('rejects invalid %s value %s and explains why', async (field, value, message) => {
    component.form.patchValue({ name: 'Water', price: 1.2, quantity: 1 });
    component.form.get(field as string)!.setValue(value);
    component.onSubmit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(TestBed.inject(MatDialogRef).close).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(message);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
  });

  it.each([0.01, 0.29, 1.1, 1.15, 1.23])('submits valid price %s as integer cents', price => {
    component.form.patchValue({ name: ' Water ', price, quantity: 1 });
    component.onSubmit();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: 'Water', price: Math.round(price * 100) }),
    );
  });

  it('associates Save with the form and submits exactly once through ngSubmit', async () => {
    component.form.patchValue({ name: 'Water', price: 1.2, quantity: 1 });
    fixture.detectChanges();
    await fixture.whenStable();
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const save = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(save.form).toBe(form);
    save.click();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledTimes(1);
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