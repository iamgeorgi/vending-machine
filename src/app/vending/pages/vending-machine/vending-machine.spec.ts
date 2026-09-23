import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendingMachine } from './vending-machine';

describe('VendingMachinePage', () => {
  let component: VendingMachine;
  let fixture: ComponentFixture<VendingMachine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingMachine],
    }).compileComponents();

    fixture = TestBed.createComponent(VendingMachine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
