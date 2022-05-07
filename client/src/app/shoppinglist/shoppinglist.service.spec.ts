import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ShoppinglistStoreGroup } from './shoppinglistStoreGroup';
import { ShoppinglistService } from './shoppinglist.service';
import { ShoppinglistDatabaseItem } from './shoppinglistDatabaseItem';
import { ExistsObject } from './existsObject';
import { of } from 'rxjs';

describe('ShoppinglistService', () => {
  const testShoppinglistStoreGroups: ShoppinglistStoreGroup[] = [
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
          count: 3
        }
      ]
    }
  ];

  const testShoppinglistItem: ShoppinglistDatabaseItem = {
    _id: 'testid',
    product: 'productId',
    count: 4
  };

  const testExistsObject: ExistsObject = {
    exists: true
  };

  let shoppinglistService: ShoppinglistService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    shoppinglistService = new ShoppinglistService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getShoppinglist() calls api/shoppinglist', () => {
    // Assert that the shoppinglistStoreGroups we get from this call to getShoppinglist()
    // should be our set of test groups. Because we're subscribing
    // to the result of getShoppinglist(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testShoppinglistStoreGroups) a few lines
    // down.
    shoppinglistService.getShoppinglist().subscribe(
      shoppingListDisplayItems => expect(shoppingListDisplayItems).toBe(testShoppinglistStoreGroups)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(shoppinglistService.shoppinglistUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testShoppinglistStoreGroups);
  });

  it('addShoppinglistItem posts to api/shoppinglist', () => {

    shoppinglistService.addShoppinglistItem(testShoppinglistItem).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(shoppinglistService.shoppinglistUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testShoppinglistItem);

    req.flush({id: 'testid'});
  });

  it('checks if product is in shoppinglist with post to api/shoppinglist', () => {
    shoppinglistService.productInShoppinglist(testShoppinglistItem.product);
  });
});
