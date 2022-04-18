import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ShoppinglistItem } from './shoppinglistItem';
import { ShoppinglistService } from './shoppinglist.service';

describe('ShoppinglistService', () => {
  const testShoppinglistItems: ShoppinglistItem[] = [
    {
      _id: 'first',
      product: 'firstProduct',
      name: 'FirstName',
      store: 'Willies',
      count: 4
    },
    {
      _id: 'second',
      product: 'secondProduct',
      name: 'SecondName',
      store: 'Willies',
      count: 8
    },
    {
      _id: 'third',
      product: 'thirdProduct',
      name: 'ThirdName',
      store: 'Willies',
      count: 12
    }
  ];

  let shoppinglistService: ShoppinglistService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    shoppinglistService = TestBed.inject(ShoppinglistService);
  });

  it('should be created', () => {
    expect(shoppinglistService).toBeTruthy();
  });
});
