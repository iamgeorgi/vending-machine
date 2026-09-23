import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoinSelector } from './coin-selector';

describe('CoinSelector', () => {
  let component: CoinSelector;
  let fixture: ComponentFixture<CoinSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
