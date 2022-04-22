import { Component, Input, OnInit } from '@angular/core';
import { ShoppinglistStoreGroup } from '../shoppinglistStoreGroup';

@Component({
  selector: 'app-shoppinglist-print',
  templateUrl: './shoppinglist-print.component.html',
  styleUrls: ['./shoppinglist-print.component.scss']
})
export class ShoppinglistPrintComponent implements OnInit {
  @Input() list: ShoppinglistStoreGroup[];

  constructor() { }

  ngOnInit(): void {
  }

}
