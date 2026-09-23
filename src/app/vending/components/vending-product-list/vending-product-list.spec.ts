import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendingProductList } from './vending-product-list';

describe('VendingProductList', () => {
  let component: VendingProductList;
  let fixture: ComponentFixture<VendingProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingProductList],
    }).compileComponents();

    fixture = TestBed.createComponent(VendingProductList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
