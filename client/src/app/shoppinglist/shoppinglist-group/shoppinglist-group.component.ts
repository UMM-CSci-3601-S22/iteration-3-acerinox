import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppinglistDialogDeleteComponent } from '../shoppinglist-dialog-delete/shoppinglist-dialog-delete.component';
import { ShoppinglistService } from '../shoppinglist.service';
import { ShoppinglistDisplayItem } from '../shoppinglistDisplayItem';
import { ShoppinglistStoreGroup } from '../shoppinglistStoreGroup';

@Component({
  selector: 'app-shoppinglist-group',
  templateUrl: './shoppinglist-group.component.html',
  styleUrls: ['./shoppinglist-group.component.scss']
})
export class ShoppinglistGroupComponent implements OnInit {
  @Input() list: ShoppinglistStoreGroup[];

  constructor(private snackBar: MatSnackBar, private shoppinglistService: ShoppinglistService, private dialog: MatDialog) {}

  ngOnInit(): void {

  }

  //Pops up a dialog to delete a product from the product list
  /* istanbul ignore next */
  removeItem(givenItem: ShoppinglistDisplayItem): void {
    const dialogRef = this.dialog.open(ShoppinglistDialogDeleteComponent, { data: givenItem });
    dialogRef.afterClosed().subscribe(
      result => {
        this.shoppinglistService.deleteItem(result).subscribe(returnedBoolean => {
          if (returnedBoolean) {
            this.snackBar.open(`${givenItem.productName} successfully removed from your shopping list.`,
              'OK', { duration: 5000 });
          }
          else {
            this.snackBar.open('Something went wrong.  The product was not removed from your shopping list.',
              'OK', { duration: 5000 });
          }
        });
      });
  }
}
