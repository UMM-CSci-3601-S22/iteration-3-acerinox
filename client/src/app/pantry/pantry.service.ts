/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../products/product';
import { PantryItem } from './pantryItem';

@Injectable()
export class PantryService {
  readonly pantryUrl: string = environment.apiUrl + 'pantry';
  readonly pantryInfoUrl: string = environment.apiUrl + 'pantry/info';

  constructor(private httpClient: HttpClient) {}

  getPantryProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.pantryUrl, {
    });
  }

  getPantry(): Observable<PantryItem[]> {
    return this.httpClient.get<PantryItem[]>(this.pantryInfoUrl, {
    });
  }

    // Filter by product_name
    if (filters.product_name) {
      filters.product_name = filters.product_name.toLowerCase();

      filteredPantry = filteredPantry.filter(product => product.product_name.toLowerCase().indexOf(filters.product_name) !== -1);
    }

    // Filter by brand
    if (filters.brand) {
      filters.brand = filters.brand.toLowerCase();

      filteredPantry = filteredPantry.filter(product => product.brand.toLowerCase().indexOf(filters.brand) !== -1);
    }

    if (filters.limit) {
      filteredPantry = filteredPantry.slice(0, filters.limit);
    }

    // Filter by category
    if (filters.category) {
      filteredPantry = filteredPantry.filter(product => product.category.indexOf(filters.category) !== -1);
    }

    return filteredPantry;
  }

  filterPantryFromPantryItems(pantryItems: PantryItem[], filters: { purchase_date: string }): PantryItem[] {
    let filteredPantry = pantryItems;

    // Filter by purchase date
    if (filters.purchase_date) {
      filters.purchase_date = filters.purchase_date.toLowerCase();

      filteredPantry = filteredPantry.filter(pantryItem => pantryItem.purchase_date.toLowerCase().indexOf(filters.purchase_date) !== -1);
    }

    return filteredPantry;
  }


}
