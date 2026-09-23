import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendingProductCard } from './vending-product-card';

describe('VendingProductCard', () => {
  let component: VendingProductCard;
  let fixture: ComponentFixture<VendingProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(VendingProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', { id: '1', name: 'Water', category: 'beverage', price: 120, quantity: 0 });
    await fixture.whenStable();
  });

  it('keeps zero-stock products visible and prevents purchase clicks', () => {
    const emit = vi.spyOn(component.buyProduct, 'emit');
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(fixture.nativeElement.textContent).toContain('Water');
    expect(fixture.nativeElement.textContent).toContain('Out of stock');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Buy Water');
    button.click();
    expect(emit).not.toHaveBeenCalled();
  });

  it('enables buying when stock becomes available and emits the product ID', async () => {
    const emit = vi.spyOn(component.buyProduct, 'emit');
    fixture.componentRef.setInput('product', { ...component.product(), quantity: 1 });
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    button.click();
    expect(emit).toHaveBeenCalledExactlyOnceWith('1');
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
