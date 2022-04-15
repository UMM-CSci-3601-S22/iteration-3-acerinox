/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { ProductListComponent } from '../product-list/product-list.component';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { PantryService } from 'src/app/pantry/pantry.service';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { create, template } from 'lodash';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-product-to-pantry',
  templateUrl: './add-product-to-pantry.component.html',
  styleUrls: ['./add-product-to-pantry.component.scss']
})

export class AddProductToPantryComponent implements OnInit {

  @Input() product: Product;
  @Output() newItemEvent = new EventEmitter<PantryItem>();

  // @Input() pantryList: PantryProductsListComponent;

  addToPantryForm: FormGroup;

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


  constructor(private fb: FormBuilder, private pantryService: PantryService,
     private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {
    this.addToPantryForm = this.fb.group({
      product: this.product._id,

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
    console.log(this.addToPantryForm.value);
    this.newItemEvent.emit(this.addToPantryForm.value);
  }
}
