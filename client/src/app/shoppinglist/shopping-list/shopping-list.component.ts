import { Component, OnInit, Output } from '@angular/core';
import { ShoppinglistStoreGroup } from '../shoppinglistStoreGroup';
import { ShoppinglistService } from '../shoppinglist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  @Output() public shoppingList: ShoppinglistStoreGroup[];
  public viewType: 'interactive' | 'print' = 'interactive';
  getShoppinglistSub: Subscription;

  constructor(private shoppinglistService: ShoppinglistService) {}

  public getShoppinglistFromServer(): void {
    this.unsub();
    this.getShoppinglistSub = this.shoppinglistService.getShoppinglist()
      .subscribe(returnedShoppinglist => {
        this.shoppingList = returnedShoppinglist;
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
  }
}
