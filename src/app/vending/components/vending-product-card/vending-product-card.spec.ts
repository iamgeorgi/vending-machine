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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
