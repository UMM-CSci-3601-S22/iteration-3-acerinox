/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, TemplateRef, ViewChild, OnInit, OnDestroy, } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, } from '@angular/material/dialog';
import { Product, ProductCategory } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { PantryService } from 'src/app/pantry/pantry.service';
import { AddProductToPantryComponent } from './add-product-to-pantry/add-product-to-pantry.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { AddProductToShoppinglistComponent } from './add-product-to-shoppinglist/add-product-to-shoppinglist.component';
import { ShoppinglistService } from 'src/app/shoppinglist/shoppinglist.service';


@Component({
  selector: 'app-product-list-component',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: []
})

export class ProductListComponent implements OnInit, OnDestroy {
  // MatDialog
  @ViewChild('deleteDialogRef')
  deleteDialogRef!: TemplateRef<any>;

  public serverFilteredProducts: Product[];
  public filteredProducts: Product[];

  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;
  public productLimit: number;
  getProductsSub: Subscription;
  getUnfilteredProductsSub: Subscription;

  // Boolean for if there are active filters
  public activeFilters: boolean;

  // A list of the categories to be displayed, requested by the customer
  public categoriesList: ProductCategory[] = [
    'baked goods',
    'baking supplies',
    'beverages',
    'cleaning products',
    'dairy',
    'deli',
    'frozen foods',
    'herbs/spices',
    'meat',
    'miscellaneous',
    'paper products',
    'pet supplies',
    'produce',
    'staples',
    'toiletries',
  ];

  // A list of the categories to be displayed, requested by the customer
  public storesList: string[] = [
    'Willies',
    'Pomme de Terre',
    'RealFoodHub',
    'Other Store',
  ];

  // Stores the products sorted by their category
  public categoryNameMap = new Map<ProductCategory, Product[]>();

  constructor(private productService: ProductService, private snackBar: MatSnackBar, private pantryService: PantryService,
    private shoppinglistService: ShoppinglistService, private dialog: MatDialog) { }

  getProductsFromServer(): void {
    this.unsub();
    this.getProductsSub = this.productService.getProducts({
      category: this.productCategory,
      store: this.productStore
    }).subscribe(returnedProducts => {
      if (this.productCategory || this.productStore) {
        this.activeFilters = true;
      }
      else {
        this.activeFilters = false;
      }
      this.serverFilteredProducts = returnedProducts;
      this.initializeCategoryMap();
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  // Sorts products based on their category
  initializeCategoryMap() {
    for (let givenCategory of this.categoriesList) {
      this.categoryNameMap.set(givenCategory,
        this.productService.filterProducts(this.serverFilteredProducts, { category: givenCategory }));

    }
    console.log(this.categoryNameMap);
  }


  public updateFilter(): void {
    this.filteredProducts = this.productService.filterProducts(
      this.serverFilteredProducts, { productName: this.name, brand: this.productBrand, limit: this.productLimit });
    if (this.name || this.productBrand || this.productCategory || this.productStore) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }

  }

  ngOnInit(): void {
    this.getProductsFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getProductsSub) {
      this.getProductsSub.unsubscribe();
    }
  }

  // Pops up a dialog to add a product to the pantry
  /* istanbul ignore next */
  openPantryAddDialog(givenProduct: Product) {
    const dialogRef = this.dialog.open(AddProductToPantryComponent, { data: givenProduct });
    dialogRef.afterClosed().subscribe(result => {
      this.pantryService.addPantryItem(result).subscribe(newPantryId => {
        if (newPantryId) {
          this.snackBar.open('Product successfully added to your pantry.',
            'OK', { duration: 5000 });
        }
        else {
          this.snackBar.open('Something went wrong.  The product was not added to the pantry.',
            'OK', { duration: 5000 });
        }
      });
    });
  }

    // Pops up a dialog to add a product to the shoppinglist
  /* istanbul ignore next */
  openShoppinglistAddDialog(givenProduct: Product) {
    const dialogRef = this.dialog.open(AddProductToShoppinglistComponent, { data: givenProduct });
    dialogRef.afterClosed().subscribe(result => {
      this.shoppinglistService.addShoppinglistItem(result).subscribe(newPantryId => {
        if (newPantryId) {
          this.snackBar.open('Product successfully added to your shoppinglist.',
            'OK', { duration: 5000 });
        }
        else {
          this.snackBar.open('Something went wrong.  The product was not added to the shoppinglist.',
            'OK', { duration: 5000 });
        }
      });
    });
  }

  //Pops up a dialog to delete a product from the product list
  /* istanbul ignore next */
  removeProduct(givenProduct: Product): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { data: givenProduct });
    dialogRef.afterClosed().subscribe(
      result => {
        this.productService.deleteProduct(result).subscribe(returnedBoolean => {
          if (returnedBoolean) {
            this.snackBar.open('Product successfully deleted.',
              'OK', { duration: 5000 });
          }
          else {
            this.snackBar.open('Something went wrong.  The product was not removed from your product list.',
              'OK', { duration: 5000 });
          }
        });
      });
    this.updateFilter();
    this.initializeCategoryMap();
  }
}
