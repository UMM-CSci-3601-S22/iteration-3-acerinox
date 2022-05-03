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
  @Output() public list: ShoppinglistStoreGroup[];

  // Page view, determines DOM elements displayed
  public viewType: 'interactive' | 'print' = 'interactive';

  getShoppinglistSub: Subscription;

  constructor(private shoppinglistService: ShoppinglistService) {}


  initPageTitle(value: string) {
    this.pageTitle.emit(value);
  }

  public getShoppinglistFromServer(): void {
    this.unsub();
    this.getShoppinglistSub = this.shoppinglistService.getShoppinglist()
      .subscribe(returnedShoppinglist => {
        this.shoppingList = returnedShoppinglist;
        console.log(returnedShoppinglist);
      }, err => {
        console.log(err);
      });
  }

  unsub(): void {
    if (this.getShoppinglistSub) {
      this.getShoppinglistSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getShoppinglistFromServer();
    this.initPageTitle('Shopping List');
  }

  ngOnDestroy(): void {
    this.unsub();
  }
}
