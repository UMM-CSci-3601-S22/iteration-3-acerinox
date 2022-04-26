import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ShoppinglistStoreGroup } from './shoppinglistStoreGroup';
import { ShoppinglistService } from './shoppinglist.service';

describe('ShoppinglistService', () => {
  const testShoppinglistStoreGroups: ShoppinglistStoreGroup[] = [
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
});
