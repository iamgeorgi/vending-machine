import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductApiService } from './services/product-api.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  productsApi = inject(ProductApiService);
  products = toSignal(this.productsApi.getProducts(), { initialValue: []});

  constructor() {
    effect(() => {
      console.log('Products:', this.products());
    });
  }
}
