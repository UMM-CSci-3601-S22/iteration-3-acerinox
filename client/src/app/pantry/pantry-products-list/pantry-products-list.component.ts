import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Product, ProductCategory } from 'src/app/products/product';
import { PantryItem } from '../pantryItem';
import { PantryService } from '../pantry.service';
import { MatTableDataSource } from '@angular/material/table';

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
  public comboArray: Array<any>;

  // Unique pantry list
  public uniquePantry: PantryItem[];

  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;
  public productLimit: number;
  getProductsSub: Subscription;
  getPantrySub: Subscription;

  // Product Category lists
  public bakeryProducts: Product[];
  public produceProducts: Product[];
  public meatProducts: Product[];
  public dairyProducts: Product[];
  public frozenProducts: Product[];
  public cannedProducts: Product[];
  public drinkProducts: Product[];
  public generalProducts: Product[];
  public seasonalProducts: Product[];
  public miscellaneousProducts: Product[];

  // Columns displayed
  displayedColumns: string[] = ['product', 'purchase_date', 'notes'];
  /**
   * This constructor injects both an instance of `PantryService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param pantryService the `PantryService` used to get products in the pantry
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private pantryService: PantryService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  /*
  * Get the products in the pantry from the server,
  */
  getPantryItemsFromServer() {
    this.unsubProduct();
    this.unsubPantry();
    this.pantryService.getPantryProducts().subscribe(returnedPantryProducts => {

      this.matchingProducts = returnedPantryProducts;
    }, err => {
      // If there was an error getting the users, log
      // the problem and display a message.
      console.error('We couldn\'t get the list of todos; the server might be down');
      this.snackBar.open(
        'Problem contacting the server – try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
    });

    this.pantryService.getPantry().subscribe(returnedPantry => {

      this.pantryInfo = returnedPantry;
      this.createComboMapToArray();
      this.pantryInfo.sort((a, b) => {
        const dateA = a.purchase_date.toLowerCase();
        const dateB = b.purchase_date.toLowerCase();
        return dateA > dateB ? 1 : -1;
      });
      this.createUniquePantry();
      console.log(this.uniquePantry);
    }, err => {
      // If there was an error getting the users, log
      // the problem and display a message.
      console.error('We couldn\'t get the list of todos; the server might be down');
      this.snackBar.open(
        'Problem contacting the server – try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
    });
  }

  // Necessary? Leaving for now but not using the ComboMap for anything atm
  createComboMapToArray() {
    const tempMap = new Map();
    this.matchingProducts.forEach((product, index) => {
      const pantryItem = this.pantryInfo[index];
      const productItem = product;
      tempMap.set(productItem, pantryItem);
    });
    this.comboArray = Array.from(tempMap, ([product, pantryItem]) => ({ product, pantryItem }));
    console.log(this.comboArray);
  }

  createUniquePantry() {
    const check = new Set();
    this.uniquePantry = this.pantryInfo.filter(pItem => !check.has(pItem.product) && check.add(pItem.product));
  }

  /*
  * Starts an asynchronous operation to update the users list
  */
  ngOnInit(): void {
    this.getPantryItemsFromServer();
  }

  unsubProduct(): void {
    if (this.getProductsSub) {
      this.getProductsSub.unsubscribe();
    }
  }

  unsubPantry(): void {
    if (this.getPantrySub) {
      this.getPantrySub.unsubscribe();
    }
  }

}
