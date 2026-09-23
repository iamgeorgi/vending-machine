import { CoinFormatterPipe } from '../../../shared/pipes/coin-formatter.pipe';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transaction-summary',
  imports: [
    CurrencyPipe,
    CoinFormatterPipe,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './transaction-summary.html',
  styleUrl: './transaction-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionSummary {
  readonly insertedAmount = input.required<number>();

  readonly returnedCoins = input<readonly number[]>([]);

  readonly error = input<string | null>(null);

  readonly reset = output<void>();

  onReset(): void {
    this.reset.emit();
  }

}