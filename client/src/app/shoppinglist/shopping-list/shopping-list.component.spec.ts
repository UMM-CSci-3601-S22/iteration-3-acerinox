import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockShoppingListService } from 'src/testing/shopping-list.service.mock';
import { ShoppinglistService } from '../shoppinglist.service';

import { ShoppingListComponent } from './shopping-list.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

const COMMON_IMPORTS: any[] = [
  HttpClientTestingModule,
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
  MatSnackBarModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  MatTabsModule,
];

describe('ShoppingListComponent', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let shoppinglistService: ShoppinglistService;
  let shoppinglist: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ ShoppingListComponent ],
      providers: [
        { provide: ShoppinglistService, useValue: new MockShoppingListService() }
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    shoppinglistService = TestBed.inject(ShoppinglistService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ShoppingListComponent);
      shoppinglist = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(shoppinglist).toBeTruthy();
  });

  it('should get the shoppinglist and contain all of the StoreGroups', () => {
    shoppinglist.getShoppinglistFromServer();
    expect(shoppinglist.shoppingList.length).toBe(3);
  });

  it('should have the correct shopping list when the list is reset.', () => {
    const resetSpy = spyOn(shoppinglistService, 'resetShoppingList').and.callThrough();

    shoppinglistService.resetShoppingList();

    expect(resetSpy).toHaveBeenCalled();
    expect(resetSpy.calls.mostRecent().args).toEqual([]);
  });
});
