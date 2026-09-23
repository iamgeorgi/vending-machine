import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'coinFormatter' })
export class CoinFormatterPipe implements PipeTransform {
  transform(cents: number): string {
    return cents >= 100 ? `\u20ac${cents / 100}` : `${cents}c`;
  }
}
