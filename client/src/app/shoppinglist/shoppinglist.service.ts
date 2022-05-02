import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
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
}
