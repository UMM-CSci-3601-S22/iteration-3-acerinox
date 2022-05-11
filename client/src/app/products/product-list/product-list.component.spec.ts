import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProductService } from '../../../testing/product.service.mock';
import { Product } from '../product';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';
import { PantryService } from 'src/app/pantry/pantry.service';
import { MockPantryService } from 'src/testing/pantry.service.mock';
import { ShoppinglistService } from 'src/app/shoppinglist/shoppinglist.service';
import { MockShoppingListService } from 'src/testing/shopping-list.service.mock';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  MatDialogModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('ProductListComponent', () => {
  let productList: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: new MockProductService() },
         { provide: PantryService, useValue: new MockPantryService() },
        { provide: ShoppinglistService, useValue: new MockShoppingListService() }]
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProductListComponent);
      productList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(productList).toBeTruthy();
  });

  it('contains all the products', () => {
    expect(productList.serverFilteredProducts.length).toBe(3);
  });

  it('contains a product named \'banana\'', () => {
    expect(productList.serverFilteredProducts.some((product: Product) => product.productName === 'banana')).toBe(true);
  });

  it('contain a product named \'Wheat Bread\'', () => {
    expect(productList.serverFilteredProducts.some((product: Product) => product.productName === 'Wheat Bread')).toBe(true);
  });

  it('doesn\'t contain a product named \'Santa\'', () => {
    expect(productList.serverFilteredProducts.some((product: Product) => product.productName === 'Santa')).toBe(false);
  });

  it('has one product that is dairy', () => {
    expect(productList.serverFilteredProducts.filter((product: Product) => product.category === 'dairy').length).toBe(1);
  });

  it('should update filteredProducts on activeFilters', () => {
    productList.productCategory = 'produce';
    productList.productBrand = 'Dole';
    productList.getProductsFromServer();
    expect(productList.filteredProducts.some((product: Product) => product.productName === 'banana')).toBe(true);
  });

  it('should fill in categoryNameMap with brand key to array of product objects value', () => {
    expect(productList.categoryNameMap.get('produce'))
    .toEqual([{
      _id: 'banana_id',
      productName: 'banana',
      description: '',
      brand: 'Dole',
      category: 'produce',
      store: 'Walmart',
      location: 'c 1',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    }]);
  });

});


describe('Delete From ProductList', () => {
  let productList: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: new MockProductService() },
      {provide: PantryService, useValue: new MockPantryService()},
      {provide: MAT_DIALOG_DATA, useValue: MockProductService.testProducts[0]}]
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProductListComponent);
      productList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
/*
  it('should delete an item from the products list', () => {
  });
 */
});
