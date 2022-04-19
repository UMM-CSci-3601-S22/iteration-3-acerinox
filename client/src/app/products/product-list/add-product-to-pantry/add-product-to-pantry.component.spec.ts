/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPantryService } from 'src/testing/pantry.service.mock';
import { PantryService } from 'src/app/pantry/pantry.service';
import { ProductService } from '../../product.service';
import { AddProductToPantryComponent } from './add-product-to-pantry.component';
import { SingleProductPageComponent } from '../../single-product-page/single-product-page.component';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AddDialogComponent', () => {
  let component: AddProductToPantryComponent;
  let fixture: ComponentFixture<AddProductToPantryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductToPantryComponent], providers: [{provide: MAT_DIALOG_DATA, UseValue: {}
     }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductToPantryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 });
