/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, TemplateRef, ViewChild, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Product, ProductCategory } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { PantryService } from 'src/app/pantry/pantry.service';
import { AddProductToPantryComponent } from './add-product-to-pantry/add-product-to-pantry.component';


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

  @Input() product: Product;

  @Output() newItemEvent = new EventEmitter<PantryItem>();

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

  // temp variables to use for deletion
  public tempId: string;
  public tempName: string;
  public tempDialog: any;
  public tempDeleted: Product;
  constructor(private productService: ProductService, private snackBar: MatSnackBar, private pantryService: PantryService,
    private dialog: MatDialog) { }

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

  openDeleteDialog(pname: string, id: string) {
    this.tempId = id;
    this.tempName = pname;
    this.tempDialog = this.dialog.open(this.deleteDialogRef, { data: { name: this.tempName, _id: this.tempId } },);
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
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

  // Removes the product and updates the categoryNameMap to reflect the deletion
  removeProduct(id: string): Product {
    this.productService.deleteProduct(id).subscribe(
      prod => {
        this.serverFilteredProducts = this.serverFilteredProducts.filter(product => product._id !== id);
        this.tempDeleted = prod;
        this.updateFilter();
        this.initializeCategoryMap();
      }
    );
    this.tempDialog.close();
    this.snackBar.open(`${this.tempDeleted.productName} deleted`, 'OK', {
      duration: 5000,
    });
    return this.tempDeleted;
  }


  addProductToPantry(pantryItem: PantryItem) {
    this.pantryService.addPantryItem(pantryItem);
  }

  openAddDialog() {
    this.dialog.open(AddProductToPantryComponent);
  }
}
