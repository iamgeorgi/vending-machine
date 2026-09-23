import { CurrencyPipe } from '@angular/common';
import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'euroPrice' })
export class EuroPricePipe implements PipeTransform {
  private readonly currency = new CurrencyPipe(inject(LOCALE_ID));

  transform(cents: number): string | null {
    return this.currency.transform(cents / 100, 'EUR');
  }
}
