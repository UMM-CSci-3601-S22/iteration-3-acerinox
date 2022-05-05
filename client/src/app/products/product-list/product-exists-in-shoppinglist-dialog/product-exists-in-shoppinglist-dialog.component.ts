import { Component, Inject, OnInit } from '@angular/core';
import { Product } from '../../product';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';

@Component({
  selector: 'app-product-exists-in-shoppinglist-dialog',
  templateUrl: './product-exists-in-shoppinglist-dialog.component.html',
  styleUrls: ['./product-exists-in-shoppinglist-dialog.component.scss']
})
export class ProductExistsInShoppinglistDialogComponent implements OnInit {

  /* istanbul ignore next */
  constructor(public dialogRef: MatDialogRef<ProductExistsInShoppinglistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) { }

  /* istanbul ignore next */
  ngOnInit(): void {
  }

  /* istanbul ignore next */
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Won't ignore this later since it will be doing something meaningful
  /* istanbul ignore next */
  storeContentPos(store: string) {
    return '';
  }
}
