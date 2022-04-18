/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../product';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-to-pantry',
  templateUrl: './add-product-to-pantry.component.html',
  styleUrls: ['./add-product-to-pantry.component.scss']
})

export class AddProductToPantryComponent implements OnInit {

  // @Input() pantryList: PantryProductsListComponent;

  addToPantryForm: FormGroup;
  newPantryItem: PantryItem;


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


  constructor(private fb: FormBuilder, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddProductToPantryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {
  }

  createForms() {
    this.addToPantryForm = this.fb.group({
      product: this.data._id,

      purchase_date: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10)
      ])),

      notes: new FormControl('', Validators.compose([
        Validators.maxLength(500)
      ])),
    });
  }

  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    return this.addToPantryForm.value;
  }
}
