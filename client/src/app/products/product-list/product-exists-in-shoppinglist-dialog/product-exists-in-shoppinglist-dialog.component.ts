import { Component, Inject, OnInit } from '@angular/core';
import { Product } from '../../product';
import { ShoppinglistDatabaseItem } from 'src/app/shoppinglist/shoppinglistDatabaseItem';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';

@Component({
  selector: 'app-product-exists-in-shoppinglist-dialog',
  templateUrl: './product-exists-in-shoppinglist-dialog.component.html',
  styleUrls: ['./product-exists-in-shoppinglist-dialog.component.scss']
})
export class ProductExistsInShoppinglistDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProductExistsInShoppinglistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) { }

  /* istanbul ignore next */
  ngOnInit(): void {
  }

  /* istanbul ignore next */
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Won't ignore this in code coverage since in the future it will be doing something meaningful
  storeContentPos(store: string) {
    return '';
  }
}
