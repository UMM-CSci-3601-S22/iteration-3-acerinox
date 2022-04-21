import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ShoppinglistService } from 'src/app/shoppinglist/shoppinglist.service';
import { ShoppinglistStoreGroup } from 'src/app/shoppinglist/shoppinglistStoreGroup';

@Injectable()
export class MockShoppingListService extends ShoppinglistService{
  static testShoppinglistStoreGroups: ShoppinglistStoreGroup[] = [
    {
      store: 'firstStore',
      products: [
        {
          productName: 'firstProduct',
          location: 'firstAisle',
          count: 1
        }
      ]
    },
    {
      store: 'secondStore',
      products: [
        {
          productName: 'secondProduct',
          location: 'secondAisle',
          count: 2
        }
      ]
    },
    {
      store: 'thirdStore',
      products: [
        {
          productName: 'thirdProduct',
          location: 'thirdAisle',
          count: 3
        }
      ]
    }
  ];

  constructor() {
    super(null);
  }

  getShoppinglist(): Observable<ShoppinglistStoreGroup[]> {
    return of(MockShoppingListService.testShoppinglistStoreGroups);
  }

}
