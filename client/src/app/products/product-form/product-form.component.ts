import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { BehaviorSubject, filter, Subscription } from 'rxjs';
export type FormMode = 'EDIT' | 'ADD';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  static editMessageSuccess = 'Edited Product';
  static editMessageFail = 'Failed to edit product';
  static addMessageSuccess = 'Added Product';
  static addMessageFail = 'Failed to add product';

  @Input() mode: FormMode;

  productForm: FormGroup;

  productObservable: BehaviorSubject<Product> = new BehaviorSubject<null>(null);
  product: Product;

  id: string;
  editProductSub: Subscription;



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
        type: 'pattern', message: 'Category must be, baked goods, baking supplies, beverages, cleaning products, dairy' +
          ', deli, frozen foods, herbs/spices, meat, miscellaneous, paper products, pet supplies, produce, staples, or toiletries'
      },
    ],
    store: [
      { type: 'required', message: 'Product store is required' },
      { type: 'minlength', message: 'Product store must be at least 1 character' },
      { type: 'maxlength', message: 'Product store must be at less than 100 characters' }
    ],
    location: [
      { type: 'required', message: 'Must provide a location'},
      { type: 'minlength', message: 'Product location must be at least 1 character' },
      { type: 'maxlength', message: 'Product location must be at less than 100 characters' }
    ],
    notes: [
      { type: 'minlength', message: 'Product notes must be at least 1 character' },
      { type: 'maxlength', message: 'Product notes must be at less than 2000 characters' }
    ],
    tags: [
      { type: 'minlength', message: 'Product notes must be at least 1 character' },
      { type: 'maxlength', message: 'Product notes must be at less than 50 characters' }
    ],
    lifespan: [
      { type: 'min', message: 'Product lifespan must be at least 0' },
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
    private router: Router,
    private route: ActivatedRoute) { }


  // A helper function for auto-filling the form fields that returns the existing value
  // or it just returns the empty string if it doesn't
  getProductValueOrEmptyString(key: string): string {
    if (this.product && this.product[key] !== null && this.product[key] !== undefined) {
      return this.product[key];
    }
    if (['lifespan', 'threshold'].indexOf(key) > -1) {
      return '1';
    }
    return '';
  }

  createForms() {
    this.productForm = this.fb.group({
      productName: new FormControl(this.getProductValueOrEmptyString('productName'), Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(200),
      ])),
      description: new FormControl(this.getProductValueOrEmptyString('description'), Validators.compose([
        Validators.minLength(1), Validators.maxLength(500),
      ])),
      brand: new FormControl(this.getProductValueOrEmptyString('brand'), Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(100),
      ])),
      category: new FormControl(this.getProductValueOrEmptyString('category'), Validators.compose([
        Validators.required,
        // eslint-disable-next-line max-len
        Validators.pattern('^(baked goods|baking supplies|beverages|cleaning products|dairy|deli|frozen foods|herbs/spices|meat|miscellaneous|paper products|pet supplies|produce|staples|toiletries)$')
      ])),
      store: new FormControl(this.getProductValueOrEmptyString('store'), Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(100),
      ])),
      location: new FormControl(this.getProductValueOrEmptyString('location'), Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(100),
      ])),
      notes: new FormControl(this.getProductValueOrEmptyString('notes'), Validators.compose([
        Validators.minLength(1), Validators.maxLength(2000),
      ])),
      tags: new FormControl([], Validators.compose([])),
      lifespan: new FormControl(this.getProductValueOrEmptyString('lifespan'), Validators.compose([
        Validators.min(0), Validators.max(1000000), Validators.pattern('^[0-9]+$')
      ])),
      threshold: new FormControl(this.getProductValueOrEmptyString('threshold'), Validators.compose([
        Validators.min(1), Validators.max(1000000), Validators.pattern('^[0-9]+$')
      ])),
      image: new FormControl(this.getProductValueOrEmptyString('image'), Validators.compose([])),
    });
  }

  setProduct(): void {
    if (this.mode === 'EDIT') {
      this.route.params.subscribe(params => {
        this.id = params.id;
        if (this.editProductSub) {
          this.editProductSub.unsubscribe();
        }
        this.editProductSub = this.productService.getProductById(this.id).subscribe(product => {
          this.productObservable.next(product);
        });
      });
    }
  }

  ngOnInit(): void {
    this.setProduct();
    if (this.mode === 'EDIT') {
      this.productObservable.pipe(
        filter(val => val !== undefined && val !== null)
      ).subscribe(product => {
        this.product = product;
        this.createForms();
        console.log(this.productForm.controls.productName);
      });
    }
    else {
      this.createForms();
    }
  }

  ngOnDestroy(): void {
    if (this.editProductSub) {
      this.editProductSub.unsubscribe();
    }
  }


  //Right now only non-required fields can be edited.
  async submitForm(): Promise<void> {
    /* istanbul ignore next */
    if (this.mode === 'ADD') {
      try {
        const newID = await this.productService.addProduct(this.productForm.value).toPromise();
        this.snackBar.open(`${ProductFormComponent.addMessageSuccess}: ${this.productForm.value.productName}`, 'OK', {duration: 5000});
        this.router.navigate(['/products/' + newID]);
      } catch (e) {
        this.snackBar.open(ProductFormComponent.addMessageFail, 'OK', {
          duration: 5000,
        });
      }
    }
    else if (this.mode === 'EDIT') {
      try {
        const newProduct = await this.productService.editProduct(this.id, this.productForm.value).toPromise();
        this.snackBar.open(`${ProductFormComponent.editMessageSuccess}: ${this.productForm.value.productName}`, 'OK', {
          duration: 5000,
        });
        this.router.navigate(['/products/' + newProduct._id]);
      } catch (e) {
        this.snackBar.open(ProductFormComponent.editMessageFail, 'OK', {duration: 5000});
      }
    }
  }

  //Trying to do the same thing as the above method, but with subscribes instead of async
  sendSubmit(): void {
    if (this.mode === 'ADD') {
      this.productService.addProduct(this.productForm.value).subscribe(returnedId => {
        this.snackBar.open(`${ProductFormComponent.addMessageSuccess}: ${this.productForm.value.productName}`);
        this.router.navigate(['/products/' + returnedId]);
      });
    }
    else if (this.mode === 'EDIT') {
      this.productService.editProduct(this.id, this.productForm.value).subscribe(returnedProduct => {
      this.snackBar.open(`${ProductFormComponent.editMessageSuccess}: ${this.productForm.value.productName}`, null, {
        duration: 2000,
      });
      this.router.navigate(['/products/' + returnedProduct._id]);
      });
    }
  }

}
