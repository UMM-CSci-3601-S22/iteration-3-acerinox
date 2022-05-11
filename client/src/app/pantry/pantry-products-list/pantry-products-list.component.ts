/* eslint-disable prefer-const */
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Product, ProductCategory } from 'src/app/products/product';
import { PantryItem } from '../pantryItem';
import { PantryService } from '../pantry.service';
import { ComboItem } from '../pantryItem';
import { Router } from '@angular/router';
import { DeletePantryItemComponent } from './delete-pantry-item/delete-pantry-item.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pantry-products-list',
  styleUrls: ['./pantry-products-list.component.scss'],
  templateUrl: './pantry-products-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class PantryProductsListComponent implements OnInit {
  // Unfiltered lists
  public matchingProducts: Product[];
  public pantryInfo: PantryItem[];
  public comboItems: ComboItem[] = [];

  // Unique pantry & product combo object list
  public uniqueComboItems: ComboItem[];

  getProductsSub: Subscription;
  getPantrySub: Subscription;

// A list of the categories to be displayed, requested by the customer
public categories: ProductCategory[] = [
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

// Stores the products sorted by their category
public categoryNameMap = new Map<ProductCategory, ComboItem[]>();

// Columns displayed
displayedColumns: string[] = ['productName', 'brand', 'purchase_date', 'remove'];
expandedElement: PantryItem | null;

/**
 * This constructor injects both an instance of `PantryService`
 * and an instance of `MatSnackBar` into this component.
 *
 * @param pantryService the `PantryService` used to get products in the pantry
 * @param snackBar the `MatSnackBar` used to display feedback
 */
constructor(private pantryService: PantryService,
  private snackBar: MatSnackBar,
  private router: Router,
  private dialog: MatDialog) {
  // Nothing here – everything is in the injection parameters.
}

  /*
  * Get the products in the pantry from the server,
  */
  getProductsAndPantryFromServer() {
    this.unsubProduct();
    this.getPantryFromServer();
    this.pantryService.getPantryProducts().subscribe(returnedPantryProducts => {

      this.matchingProducts = returnedPantryProducts;
      this.createComboItems();
      this.comboItems.sort((a, b) => {
        let dateA = a.purchase_date;
        let dateB = b.purchase_date;
        return dateA.valueOf() > dateB.valueOf() ? 1 : -1;
      });
      this.initializeCategoryMap();
    }, err => {
      // If there was an error getting the users, log
      // the problem and display a message.
      console.error('We couldn\'t get the pantry list; the server might be down');
      this.snackBar.open(
        'Problem contacting the server - try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
    });
  }

  getPantryFromServer() {
    this.unsubPantry();

    this.pantryService.getPantry().subscribe(returnedPantry => {

      this.pantryInfo = returnedPantry;
    }, err => {
      // If there was an error getting the users, log
      // the problem and display a message.
      console.error('We couldn\'t get the list of products; the server might be down');
      this.snackBar.open(
        'Problem contacting the server - try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
    });
  }

  // Sorts products based on their category
  initializeCategoryMap() {
    for (let givenCategory of this.categories) {
      this.categoryNameMap.set(givenCategory,
        this.pantryService.filterComboItemByCategory(this.comboItems, { category: givenCategory }));
    }
  }

  createComboItems() {
    this.matchingProducts.forEach(obj => {
      delete obj._id;
      delete obj.notes;
    });
    this.pantryInfo.forEach(obj => {
      delete obj.product;
    });

    for (let i = 0; i < this.matchingProducts.length; i++) {
      const newObj = Object.assign(this.matchingProducts[i], this.pantryInfo[i]);
      this.comboItems.push(newObj);
    }

  }

  /*
  * Starts an asynchronous operation to update the pantry
  */
  ngOnInit(): void {
    this.getProductsAndPantryFromServer();
  }

  unsubProduct(): void {
    /* istanbul ignore next */
    if (this.getProductsSub) {
      this.getProductsSub.unsubscribe();
    }
  }

  unsubPantry(): void {
    /* istanbul ignore next */
    if (this.getPantrySub) {
      this.getPantrySub.unsubscribe();
    }
  }

  /* istanbul ignore next */
  reloadComponent() {
    const pantryPageUrl = '';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([pantryPageUrl]);
  }

  //Pops up a dialog to delete an item from the pantry
  /* istanbul ignore next */
  removePantryItem(givenItem: ComboItem): void {
    const dialogRef = this.dialog.open(DeletePantryItemComponent, {data: givenItem});
    dialogRef.afterClosed().subscribe(
      result => {
        this.pantryService.deleteItem(result).subscribe(returnedProductId => {
          if(returnedProductId) {
            this.snackBar.open('Item successfully removed from your pantry.', 'OK', {duration: 5000});
            this.reloadComponent();
          }
          else {
            this.snackBar.open('Something went wrong.  The item was not removed from your pantry.', 'OK', {duration: 5000});
          }
        });
      });
    }
}
