import { Component, Input, OnInit } from '@angular/core';
import { ShoppinglistStoreGroup } from '../shoppinglistStoreGroup';

@Component({
  selector: 'app-shoppinglist-group',
  templateUrl: './shoppinglist-group.component.html',
  styleUrls: ['./shoppinglist-group.component.scss']
})
export class ShoppinglistGroupComponent implements OnInit {
  @Input() list: ShoppinglistStoreGroup[];

  constructor() {}

  ngOnInit(): void {

  }
}
