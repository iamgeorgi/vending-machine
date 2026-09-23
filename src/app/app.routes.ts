import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './vending/pages/vending-machine/vending-machine'
      ).then((m) => m.VendingMachine),
  },
  {
    path: 'products',
    loadComponent: () =>
      import(
        './products/pages/product-management/product-management'
      ).then((m) => m.ProductManagement),
  },
  {
    path: '**',
    redirectTo: '',
  },
];