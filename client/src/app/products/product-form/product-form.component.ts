import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../product';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @Input() mode: 'ADD' | 'EDIT';

  productForm: FormGroup;

  product: Product;

  productValidationMessages = {
    productName: [
      { type: 'required', message: 'Product name is required' },
      { type: 'minlength', message: 'Product name must be at least 1 character' },
      { type: 'maxlength', message: 'Product name must be at less than 200 characters' }
    ],
    description: [
      { type: 'minlength', message: 'Product description must be at least 1 character' },
      { type: 'maxlength', message: 'Product description must be at less than 500 characters' }
    ],
    brand: [
      { type: 'required', message: 'Product brand is required' },
      { type: 'minlength', message: 'Product brand must be at least 1 character' },
      { type: 'maxlength', message: 'Product brand must be at less than 100 characters' }
    ],
    category: [
      { type: 'required', message: 'Product category is required' },
      {
        type: 'pattern', message: 'Category must be, bakery, produce, meat, dairy, frozen foods, ' +
          'canned goods, drinks, general grocery, miscellaneous, or seasonal'
      },
    ],
    store: [
      { type: 'required', message: 'Product store is required' },
      { type: 'minlength', message: 'Product store must be at least 1 character' },
      { type: 'maxlength', message: 'Product store must be at less than 100 characters' }
    ],
    location: [
      { type: 'minlength', message: 'Product location must be at least 1 character' },
      { type: 'maxlength', message: 'Product location must be at less than 100 characters' }
    ],
    notes: [
      { type: 'minlength', message: 'Product notes must be at least 1 character' },
      { type: 'maxlength', message: 'Product notes must be at less than 350 characters' }
    ],
    tags: [
      { type: 'minlength', message: 'Product notes must be at least 1 character' },
      { type: 'maxlength', message: 'Product notes must be at less than 50 characters' }
    ],
    lifespan: [
      { type: 'min', message: 'Product lifespan must be at least 1' },
      { type: 'max', message: 'Product lifespan must be at less than 1000000' },
      { type: 'pattern', message: 'Lifespan must be a whole number' }
    ],
    threshold: [
      { type: 'min', message: 'Product threshold must be at least 1' },
      { type: 'max', message: 'Product threshold must be at less than 1000000' },
      { type: 'pattern', message: 'Threshold must be a whole number' }
    ]
  };

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  createForms() {
    this.productForm = this.fb.group({
      productName: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(200),
      ])),
      description: new FormControl('', Validators.compose([
        Validators.minLength(1), Validators.maxLength(500),
      ])),
      brand: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(100),
      ])),
      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(bakery|produce|meat|dairy|frozen foods|canned goods|drinks|general grocery|miscellaneous|seasonal)$')
      ])),
      store: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(100),
      ])),
      location: new FormControl('', Validators.compose([
        Validators.minLength(1), Validators.maxLength(100),
      ])),
      notes: new FormControl('', Validators.compose([
        Validators.minLength(1), Validators.maxLength(350),
      ])),
      tags: null
      ,
      lifespan: new FormControl('', Validators.compose([
        Validators.min(1), Validators.max(1000000), Validators.pattern('^[0-9]+$')
      ])),
      threshold: new FormControl('', Validators.compose([
        Validators.min(1), Validators.max(1000000), Validators.pattern('^[0-9]+$')
      ])),
      image: null,
    });
  }

  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    if (this.mode === 'ADD') {
      this.productService.addProduct(this.productForm.value).subscribe(newID => {
        this.snackBar.open('Added Product' + this.productForm.value.productName, null, {
          duration: 2000,
        });
        this.router.navigate(['/products/', newID]);
        return newID;
      }, err => {
        this.snackBar.open('Failed to add the product', 'OK', {
          duration: 5000,
        });
        return null; // This is here for clarity's sake, though it isn't entirely necessary
      });
    }
    else {
      this.productService.editProduct();
    }
  }

}
