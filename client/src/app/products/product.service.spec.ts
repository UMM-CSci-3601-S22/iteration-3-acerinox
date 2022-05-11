/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from './product';
import { ProductService } from './product.service';

describe('ProductService', () => {

  const testProducts: Product[] = [
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

  let productService: ProductService;
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
    productService = new ProductService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getProducts() calls api/products', () => {
    // Assert that the products we get from this call to getProducts()
    // should be our set of test products. Because we're subscribing
    // to the result of getProducts(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testProducts) a few lines
    // down.
    productService.getProducts().subscribe(
      products => expect(products).toBe(testProducts)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(productService.productUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testProducts);
  });

  it('getProducts() calls api/products with filter parameter \'produce\'', () => {

    productService.getProducts({ category: 'produce' }).subscribe(
      products => expect(products).toBe(testProducts)
    );

    // Specify that (exactly) one request will be made to the specified URL with the category parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(productService.productUrl) && request.params.has('category')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('category')).toEqual('produce');

    req.flush(testProducts);
  });

  it('getProducts() calls api/products with filter parameter \'store\'', () => {

    productService.getProducts({ store: 'Walmart' }).subscribe(
      products => expect(products).toBe(testProducts)
    );

    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(productService.productUrl) && request.params.has('store')
    );

    expect(req.request.method).toEqual('GET');

    expect(req.request.params.get('store')).toEqual('Walmart');

    req.flush(testProducts);
  });

  it('getProducts() calls api/products with multiple filter parameters', () => {

    productService.getProducts({ category: 'baked goods', store: 'Walmart' }).subscribe(
      products => expect(products).toBe(testProducts)
    );

    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(productService.productUrl)
        && request.params.has('category') && request.params.has('store')
    );

    expect(req.request.method).toEqual('GET');

    expect(req.request.params.get('category')).toEqual('baked goods');
    expect(req.request.params.get('store')).toEqual('Walmart');

    req.flush(testProducts);
  });

  it('getProductById() calls api/products/id', () => {
    const targetProduct: Product = testProducts[1];
    const targetId: string = targetProduct._id;
    productService.getProductById(targetId).subscribe(
      product => expect(product).toBe(targetProduct)
    );

    const expectedUrl = productService.productUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetProduct);
  });

  it('filterProducts() filters by productName', () => {
    expect(testProducts.length).toBe(3);
    const name = 'a';
    expect(productService.filterProducts(testProducts, { productName: name }).length).toBe(2);
  });

  it('filterProducts() filters by brand', () => {
    expect(testProducts.length).toBe(3);
    const productBrand = 'Dole';
    expect(productService.filterProducts(testProducts, { brand: productBrand }).length).toBe(1);
  });

  it('filterProducts() filters by productName and brand', () => {
    expect(testProducts.length).toBe(3);
    const productBrand = 'Country Hearth';
    const name = 'Wheat Bread';
    expect(productService.filterProducts(testProducts, { productName: name, brand: productBrand }).length).toBe(1);
  });

  it('filterProducts() filters by limit', () => {
    expect(testProducts.length).toBe(3);
    const productLimit = 1;
    expect(productService.filterProducts(testProducts, { limit: productLimit }).length).toBe(1);
  });

  it('filterProducts() filters by category', () => {
    expect(testProducts.length).toBe(3);
    const productCategory = 'dairy';
    expect(productService.filterProducts(testProducts, { category: productCategory }).length).toBe(1);
  });

  it('addProduct() posts to api/products', () => {

    productService.addProduct(testProducts[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(productService.productUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testProducts[1]);

    req.flush({id: 'testid'});
  });

  it('editProduct() puts to api/products/:{id}', () => {
    // Make a copy of the 1st element in testProducts (milk), and edit some of the fields

    let editedProduct = testProducts[1];
    editedProduct.productName = 'Skim Milk';
    editedProduct.threshold = 10;

    productService.editProduct(testProducts[1]._id, editedProduct).subscribe(
      product => expect(product).toBe(editedProduct)
    );

    const expectedUrl = `${productService.productUrl}/${testProducts[1]._id}`;
    const req = httpTestingController.expectOne(expectedUrl);

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(editedProduct);

    req.flush(editedProduct);
  });

});
