import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Output, OnDestroy, } from '@angular/core';
import { ShoppinglistStoreGroup } from '../shoppinglistStoreGroup';
import { ShoppinglistService } from '../shoppinglist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  // Stored shoppinglist, sent to child components through input/output
  @Output() public shoppingList: ShoppinglistStoreGroup[];

  // Page view, determines DOM elements displayed
  public viewType: 'interactive' | 'print' = 'interactive';

  getShoppinglistSub: Subscription;

  constructor(private shoppinglistService: ShoppinglistService, private snackBar: MatSnackBar) {}

  public getShoppinglistFromServer(): void {
    this.unsub();
    this.getShoppinglistSub = this.shoppinglistService.getShoppinglist()
      .subscribe(returnedShoppinglist => {
        this.shoppingList = returnedShoppinglist;
      }, err => {
        console.error(err);
      });
  }

  unsub(): void {
    if (this.getShoppinglistSub) {
      this.getShoppinglistSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getShoppinglistFromServer();
  }

  /* istanbul ignore next */
  public resetShoppingList() {
    this.shoppinglistService.resetShoppingList()
      .subscribe(result => {
        this.snackBar.open('Shopping List Reset',
        'OK', { duration: 5000});
        window.location.reload();
      },
      err => {
        this.snackBar.open('Failed to reset Shopping List.',
        'OK', {duration: 5000});
        console.error(err);
      });
  }

  ngOnDestroy(): void {
      this.unsub();
  }
}
