import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit, OnChanges {

  @Input() product: Product;

  editURL: string;

  constructor() { }

  ngOnInit(): void {
    this.editURL = `/products/edit/${this.product._id}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newProduct = changes.product.currentValue;
    this.editURL = `/products/edit/${newProduct._id}`;
  }

}
