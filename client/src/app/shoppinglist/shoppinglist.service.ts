import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShoppinglistItem } from './shoppinglistItem';

@Injectable()
export class ShoppinglistService {
  readonly shoppinglistUrl: string = environment.apiUrl + 'shoppinglist';

  constructor(private httpClient: HttpClient) {}

  getShoppingList(): Observable<ShoppinglistItem[]> {
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<ShoppinglistItem[]>(this.shoppinglistUrl, {
      params: httpParams,
    });
  }
}
