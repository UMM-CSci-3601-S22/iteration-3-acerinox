import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShoppinglistDisplayItem } from '../shoppinglistDisplayItem';

@Component({
  selector: 'app-shoppinglist-dialog-delete',
  templateUrl: './shoppinglist-dialog-delete.component.html',
  styleUrls: ['./shoppinglist-dialog-delete.component.scss']
})
export class ShoppinglistDialogDeleteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ShoppinglistDialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppinglistDisplayItem) { }

  ngOnInit(): void {
  }

}
