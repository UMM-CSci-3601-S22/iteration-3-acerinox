import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShoppinglistDisplayItem } from './shoppinglistDisplayItem';

@Injectable()
export class ShoppinglistService {
  readonly shoppinglistUrl: string = environment.apiUrl + 'shoppinglist';

  constructor(private httpClient: HttpClient) {}

  getShoppinglist(): Observable<ShoppinglistDisplayItem[]> {
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<ShoppinglistDisplayItem[]>(this.shoppinglistUrl, {
      params: httpParams,
    });
  }
}
