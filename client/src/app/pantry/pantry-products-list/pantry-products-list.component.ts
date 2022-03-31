import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Product, ProductCategory } from 'src/app/products/product';
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
export class PantryProductsListComponent implements OnInit, OnDestroy {

  isTableExpanded = false;

  // Unfiltered product list
  public allPantryItems: Product[];
  public uniqueProducts: Product[];

  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;
  public productLimit: number;
  getProductsSub: Subscription;

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
  columnsToDisplay = ['amount', 'product_name', 'oldest_purchase_date', 'oldest_amount'];
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
    this.unsub();
    console.log(this.pantryService.getPantryItems());
    this.getProductsSub = this.pantryService.getPantryItems()
    .subscribe(returnedPantryProducts => {
      this.allPantryItems = returnedPantryProducts;
      //this.sortUnique();
      this.makeCategories();

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

  makeCategories() {
    this.bakeryProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'bakery'});
    this.produceProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'produce'});
    this.meatProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'meat'});
    this.dairyProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'dairy'});
    this.frozenProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'frozen foods'});
    this.cannedProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'canned goods'});
    this.drinkProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'drinks'});
    this.generalProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'general grocery'});
    this.seasonalProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'seasonal'});
    this.miscellaneousProducts = this.pantryService.filterPantryFromProducts(
      this.allPantryItems, { category: 'miscellaneous'});
  }

  /* sortUnique() {
    this.uniqueProducts = this.allPantryItems;
    let resArr = [];
    this.uniqueProducts.forEach(item =>
      {let i = resArr.findIndex(x => x._id === item._id);
      if(i <= -1){
        resArr.push({id: item.id, name: item.name});
      }
    });
  } */

  // Convert ISO 8601 date-time string to localeDateString
  convertDateToLocaleFormat(dateString: string): string {
    const stringToDate = new Date(dateString);
    return stringToDate.toLocaleDateString();
  }

  /*
  * Starts an asynchronous operation to update the users list
  */
  ngOnInit(): void {
    this.getPantryItemsFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getProductsSub) {
      this.getProductsSub.unsubscribe();
    }
  }


}
