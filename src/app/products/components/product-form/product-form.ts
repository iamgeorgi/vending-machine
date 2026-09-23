import { Component, inject } from '@angular/core';
import {
  FormBuilder, AbstractControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  Product,
  ProductCategory,
  ProductFormValue,
} from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);

  private readonly dialogRef =
    inject(MatDialogRef<ProductForm, ProductFormValue | undefined>);

  readonly product = inject<Product | null>(MAT_DIALOG_DATA);

  readonly categories = Object.values(ProductCategory);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100),
      (control: AbstractControl) => typeof control.value === 'string' && control.value.trim().length > 0
        ? null : { required: true },
    ]],
    category: [ProductCategory.Beverage, Validators.required],
    price: [0, [Validators.required, Validators.min(0.01),
      (control: AbstractControl) => {
        if (control.value == null) return null;
        const cents = Math.round(control.value * 100);
        if (!Number.isSafeInteger(cents)) return { priceRange: true };
        return cents / 100 === control.value ? null : { centPrecision: true };
      },
    ]],
    quantity: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(15),
        (control: AbstractControl) => control.value == null || Number.isSafeInteger(control.value)
          ? null : { integer: true },
      ],
    ],
  });

  constructor() {
    if (this.product) {
      this.form.reset({
        name: this.product.name,
        category: this.product.category,
        price: this.product.price / 100,
        quantity: this.product.quantity,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const formValue: ProductFormValue = {
      name: value.name.trim(),
      category: value.category,
      price: Math.round(value.price * 100),
      quantity: value.quantity,
    };

    this.dialogRef.close(formValue);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}