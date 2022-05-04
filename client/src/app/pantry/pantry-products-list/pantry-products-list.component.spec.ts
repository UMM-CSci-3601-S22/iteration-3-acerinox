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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPantryService } from 'src/testing/pantry.service.mock';
import { PantryService } from '../pantry.service';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { PantryProductsListComponent } from './pantry-products-list.component';


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
  MatSnackBarModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  MatDialogModule
];

describe('PantryProductsListComponent', () => {
  let pantryProductsList: PantryProductsListComponent;
  let fixture: ComponentFixture<PantryProductsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [PantryProductsListComponent],
      providers: [{ provide: PantryService, useValue: new MockPantryService() },
        {provide: MAT_DIALOG_DATA, useValue: MockPantryService.testPantryItems[0]}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(PantryProductsListComponent);
      pantryProductsList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(pantryProductsList).toBeTruthy();
  });

  it('populates product and pantry arrays', () => {
    expect(pantryProductsList.matchingProducts.length).toBe(4);
    expect(pantryProductsList.pantryInfo.length).toBe(4);
  });

  it('creates an array of combined pantry/product objects from the two arrays', () => {
    expect(pantryProductsList.comboItems.length).toBe(4);
  });

  it('sorts the comboItems array by date purchased', () => {
    expect(pantryProductsList.comboItems[0].purchase_date).toEqual(new Date('2020-07-16'));
  });

  it('creates the comboItems with keyvalues from both products and pantryItems', () => {
    expect(pantryProductsList.comboItems[0].brand).toBe('Land O Lakes');
    expect(pantryProductsList.comboItems[0]._id).toBe('sole_milk');
  });

  it('creates a category map of comboItems', () => {
    expect(pantryProductsList.categoryNameMap.get('dairy')[0]._id).toBe('sole_milk');
  });

});

