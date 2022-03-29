import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Product, ProductCategory } from 'src/app/products/product';
import { PantryItem } from '../pantryItem';
import { PantryService } from '../pantry.service';
import { map } from 'lodash';

@Component({
  selector: 'app-pantry-products-list',
  templateUrl: './pantry-products-list.component.html',
  styleUrls: ['./pantry-products-list.component.scss']
})
export class PantryProductsListComponent implements OnInit {
  // Unfiltered lists
  public allProducts: Product[];
  public pantryInfo: PantryItem[];
  public comboMap = new Map();

  // Unique pantry list
  public uniquePantry: PantryItem[];

  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;
  public productLimit: number;
  getProductsSub: Subscription;
  getPantrySub: Subscription;



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
    this.pantryService.getPantryItems().subscribe(returnedPantryProducts => {

      this.allProducts = returnedPantryProducts;
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

      this.pantryInfo = returnedPantry.sort((a, b) => {
        const dateA = new Date(a.purchase_date).getTime();
        const dateB = new Date(b.purchase_date).getTime();
        return dateA > dateB ? 1 : -1;
      });
      this.createUniquePantry();
      this.createComboMap();
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

  createComboMap() {
    //console.log(this.allProducts);
    //console.log(this.pantryInfo);
    this.allProducts.forEach((product, index) => {
      const pantryItem = this.pantryInfo[index];
      const productItem = product;
      this.comboMap.set(productItem, pantryItem);
      //console.log(this.comboMap.get(productItem));
    });
  }

  createUniquePantry() {
    const check = new Set();
    console.log(this.pantryInfo);
    this.uniquePantry = this.pantryInfo.filter(pItem => !check.has(pItem.product) && check.add(pItem.product));
    console.log(this.uniquePantry);
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
