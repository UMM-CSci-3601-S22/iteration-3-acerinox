/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../product';
import { ShoppinglistDatabaseItem } from 'src/app/shoppinglist/shoppinglistDatabaseItem';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-to-shoppinglist',
  templateUrl: './add-product-to-shoppinglist.component.html',
  styleUrls: ['./add-product-to-shoppinglist.component.scss']
})

export class AddProductToShoppinglistComponent implements OnInit {

  addToShoppinglistForm: FormGroup;
  newShoppinglistItem: ShoppinglistDatabaseItem;

/* istanbul ignore next */
  addPantryValidationMessages = {
    count: [
      { type: 'required', message: 'Item count is required'},
      { type: 'min', message: 'Item count must be at least 1' },
      { type: 'max', message: 'Item count must be less than 1000000' },
      { type: 'pattern', message: 'Item count must be a whole number' }
    ]
  };

/* istanbul ignore next */
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddProductToShoppinglistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {
  }
/* istanbul ignore next */
  createForms() {
    this.addToShoppinglistForm = this.fb.group({
      product: this.data._id,

      count: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(1000000),
        Validators.pattern('^[0-9]+$')
      ])),
    });
  }
/* istanbul ignore next */
  ngOnInit(): void {
    this.createForms();
  }
/* istanbul ignore next */
  onNoClick(): void {
    this.dialogRef.close();
  }
/* istanbul ignore next */
  submitForm() {
    return this.addToShoppinglistForm.value;
  }
}
