import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPrintModule } from 'ngx-print';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductService } from './products/product.service';
import { SingleProductPageComponent } from './products/single-product-page/single-product-page.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { PantryProductsListComponent } from './pantry/pantry-products-list/pantry-products-list.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { PantryService } from './pantry/pantry.service';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { ShoppingListComponent } from './shoppinglist/shopping-list/shopping-list.component';
import { ShoppinglistService } from './shoppinglist/shoppinglist.service';
import { ShoppinglistGroupComponent } from './shoppinglist/shoppinglist-group/shoppinglist-group.component';
import { ShoppinglistPrintComponent } from './shoppinglist/shoppinglist-print/shoppinglist-print.component';
import { AddProductToPantryComponent } from './products/product-list/add-product-to-pantry/add-product-to-pantry.component';
import { DialogDeleteComponent } from './products/product-list/dialog-delete/dialog-delete.component';

const MATERIAL_MODULES: any[] = [
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatSidenavModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSelectModule,
  MatOptionModule,
  MatFormFieldModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTableModule,
  MatTabsModule,
  MatButtonToggleModule
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    SingleProductPageComponent,
    AddProductComponent,
    PantryProductsListComponent,
    ProductCardComponent,
    EditProductComponent,
    ProductFormComponent,
    ShoppingListComponent,
    ShoppinglistGroupComponent,
    ShoppinglistPrintComponent,
    AddProductToPantryComponent,
    DialogDeleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MATERIAL_MODULES,
    LayoutModule,
    NgxPrintModule
  ],
  providers: [
    ProductService,
    PantryService,
    ShoppinglistService,
    PantryProductsListComponent,
    ProductListComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
