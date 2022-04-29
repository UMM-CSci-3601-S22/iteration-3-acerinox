import { Component, OnInit, Inject } from '@angular/core';
import { ComboItem } from '../../pantryItem';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-pantry-item',
  templateUrl: './delete-pantry-item.component.html',
  styleUrls: ['./delete-pantry-item.component.scss']
})
export class DeletePantryItemComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeletePantryItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComboItem) { }

  ngOnInit(): void {
  }

}
