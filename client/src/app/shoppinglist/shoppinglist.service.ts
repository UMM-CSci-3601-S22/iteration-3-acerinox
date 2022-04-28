import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShoppinglistDatabaseItem } from './shoppinglistDatabaseItem';
import { ShoppinglistStoreGroup } from './shoppinglistStoreGroup';

@Injectable()
export class ShoppinglistService {
  readonly shoppinglistUrl: string = environment.apiUrl + 'shoppinglist';

  constructor(private httpClient: HttpClient) {}

  getShoppinglist(): Observable<ShoppinglistStoreGroup[]> {
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<ShoppinglistStoreGroup[]>(this.shoppinglistUrl, {
      params: httpParams,
    });
  }

  addShoppinglistItem(newShoppinglistItem: ShoppinglistDatabaseItem): Observable<string> {
    // Send post request to add a new item to the shopping list with data from the request body.
    return this.httpClient.post<{ id: string }>(this.shoppinglistUrl, newShoppinglistItem).pipe(map(res => res.id));
  }
}
