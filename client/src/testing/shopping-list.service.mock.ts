import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ShoppinglistService } from 'src/app/shoppinglist/shoppinglist.service';
import { ShoppinglistStoreGroup } from 'src/app/shoppinglist/shoppinglistStoreGroup';

@Injectable()
export class MockShoppingListService extends ShoppinglistService {

  static testShoppinglistStoreGroups: ShoppinglistStoreGroup[] = [
    {
      store: 'firstStore',
      products: [
        {
          _id: 'firstId',
          productId: 'firstProductId',
          brand: 'firstBrand',
          productName: 'firstProductName',
          location: 'firstAisle',
          count: 1
        }
      ]
    },
    {
      store: 'secondStore',
      products: [
        {
          _id: 'secondId',
          productId: 'secondProductId',
          brand: 'secondBrand',
          productName: 'secondProductName',
          location: 'secondAisle',
          count: 2
        }
      ]
    },
    {
      store: 'thirdStore',
      products: [
        {
          _id: 'thirdId',
          productId: 'thirdProductId',
          brand: 'thirdBrand',
          productName: 'thirdProductName',
          location: 'thirdAisle',
          count: 1
        }
      ]
    }
  ];

  constructor() {
    super(null);
  }

  override getShoppinglist(): Observable<ShoppinglistStoreGroup[]> {
      return of(MockShoppingListService.testShoppinglistStoreGroups);
  }

  override resetShoppingList(): Observable<void> {
      return of(null);
  }
}
