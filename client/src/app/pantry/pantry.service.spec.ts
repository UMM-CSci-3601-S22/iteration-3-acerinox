/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../products/product';
import { PantryItem } from './pantryItem';

import { PantryService } from './pantry.service';

describe('PantryService', () => {

  const testPantryProducts: Product[] = [
    {
      _id: 'banana_id',
      productName: 'banana',
      description: '',
      brand: 'Dole',
      category: 'produce',
      store: 'Walmart',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'milk_id',
      productName: 'Whole Milk',
      description: '',
      brand: 'Land O Lakes',
      category: 'dairy',
      store: 'SuperValu',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'bread_id',
      productName: 'Wheat Bread',
      description: '',
      brand: 'Country Hearth',
      category: 'baked goods',
      store: 'Walmart',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    }
  ];

  const testPantryItems: PantryItem[] = [
    {
     _id: 'first_banana',
     product: 'banana_id',
     purchase_date: new Date('2022-03-30')
    },
    {
     _id: 'sole_milk',
     product: 'milk_id',
     purchase_date: new Date('2020-07-16')
    },
    {
     _id: 'second_banana',
     product: 'banana_id',
     purchase_date: new Date('2022-03-31')
    },
    {
     _id: 'sole_bread',
     product: 'bread_id',
     purchase_date: new Date('2022-03-27')
    }
  ];

  let pantryService: PantryService;
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
    pantryService = new PantryService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getPantryItems() calls api/pantry', () => {
    // Assert that the products we get from this call to getPantryItems()
    // should be our set of test products. Because we're subscribing
    // to the result of getPantryItems(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testPantryProducts) a few lines
    // down.
    pantryService.getPantryProducts().subscribe(
      products => expect(products).toBe(testPantryProducts)
    );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(pantryService.pantryUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testPantryProducts);

  });

  it('getPantry() calls api/pantry/info', () => {
    // Assert that the pantryItems we get from this call to getPantryItems()
    // should be our set of test pantryItems. Because we're subscribing
    // to the result of getPantryItems(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testPantryProducts) a few lines
    // down.
    pantryService.getPantry().subscribe(
      pantryItems => expect(pantryItems).toBe(testPantryItems)
    );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(pantryService.pantryInfoUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testPantryItems);

  });

});
