import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { SingleProductPageComponent } from './products/single-product-page/single-product-page.component';
import { PantryProductsListComponent } from './pantry/pantry-products-list/pantry-products-list.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ShoppingListComponent } from './shoppinglist/shopping-list/shopping-list.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: PantryProductsListComponent, data: {title: 'Handy Pantry'}},
  {path: 'products', component: ProductListComponent, data: {title: 'Products List'}},
  {path: 'products/new', component: AddProductComponent, data: {title: 'Products List'}},
  {path: 'products/edit/:id', component: EditProductComponent, data: {title: 'Products List'}},
  {path: 'products/:id', component: SingleProductPageComponent, data: {title: 'Products List'}},
  {path: 'shoppinglist', component: ShoppingListComponent, data: {title: 'Products List'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
