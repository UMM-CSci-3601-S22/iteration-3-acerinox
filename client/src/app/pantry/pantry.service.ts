/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../products/product';
import { ProductCategory } from '../products/product';
import { PantryItem } from './pantryItem';
import { ComboItem } from './pantryItem';

@Injectable()
export class PantryService {
  readonly pantryUrl: string = environment.apiUrl + 'pantry';
  readonly pantryInfoUrl: string = environment.apiUrl + 'pantry/info';

  constructor(private httpClient: HttpClient) { }

  getPantryProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.pantryUrl, {
    });
  }

  getPantry(): Observable<PantryItem[]> {
    return this.httpClient.get<PantryItem[]>(this.pantryInfoUrl, {
    });
  }

  // eslint-disable-next-line max-len
  filterComboItemByCategory(comboItems: ComboItem[], filters: { category?: ProductCategory }): ComboItem[] {

    let filteredCombos = comboItems;

    // Filter by category
    if (filters.category) {
      filteredCombos = filteredCombos.filter(combo => combo.category.indexOf(filters.category) !== -1);
    }

    return filteredCombos;
  }

  addPantryItem(newPantryItem: PantryItem): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{ id: string }>(this.pantryUrl, newPantryItem).pipe(map(res => res.id));
  }

  deleteItem(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.pantryUrl}/${id}`);
  }
}
