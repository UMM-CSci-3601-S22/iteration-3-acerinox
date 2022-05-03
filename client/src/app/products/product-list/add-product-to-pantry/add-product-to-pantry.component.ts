/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../product';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-to-pantry',
  templateUrl: './add-product-to-pantry.component.html',
  styleUrls: ['./add-product-to-pantry.component.scss']
})

export class AddProductToPantryComponent implements OnInit {

  addToPantryForm: FormGroup;
  newPantryItem: PantryItem;

/* istanbul ignore next */
  addPantryValidationMessages = {
    purchase_date: [
      {type: 'required', message: 'Purchase date is required'},
      {type: 'maxlength', message: 'Pantry item date must be 10 characters'},
      {type: 'minlength', message: 'Pantry item date must be 10 characters'}
    ],
    notes: [
      {type: 'maxlength', message: 'Pantry item notes must be less than 500 characters'}
    ]
  };

/* istanbul ignore next */
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddProductToPantryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {
  }
/* istanbul ignore next */
  createForms() {
    this.addToPantryForm = this.fb.group({
      product: this.data._id,

      purchase_date: new FormControl(new Date(),
      Validators.compose([
        Validators.required
      ])),

      notes: new FormControl('', Validators.compose([
        Validators.maxLength(500)
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
    console.log(this.addToPantryForm.value);
    return this.addToPantryForm.value;
  }
}
