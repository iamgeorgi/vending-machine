import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionSummary } from './transaction-summary';

describe('TransactionSummary', () => {
  let component: TransactionSummary;
  let fixture: ComponentFixture<TransactionSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSummary);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('insertedAmount', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
