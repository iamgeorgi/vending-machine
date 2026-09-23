import { Routes } from '@angular/router';

export const VENDING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/vending-machine/vending-machine')
        .then(m => m.VendingMachine),
  }
];