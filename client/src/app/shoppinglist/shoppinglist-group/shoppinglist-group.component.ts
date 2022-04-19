import { Component, OnInit } from '@angular/core';
import { ShoppinglistDisplayItem } from '../shoppinglistDisplayItem';
import { ShoppinglistStoreGroup } from '../shoppinglistStoreGroup';
import { ShoppinglistService } from '../shoppinglist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shoppinglist-group',
  templateUrl: './shoppinglist-group.component.html',
  styleUrls: ['./shoppinglist-group.component.scss']
})
export class ShoppinglistGroupComponent implements OnInit {
  public shoppingList: ShoppinglistStoreGroup[];
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
