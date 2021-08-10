import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-product-add-edit-status',
  templateUrl: './product-add-edit-status.component.html',
  styleUrls: ['./product-add-edit-status.component.scss']
})
export class ProductAddEditStatusComponent implements OnInit {

  constructor(
    private dialog:MatDialogRef<ProductAddEditStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
  }

  closePP(state){
    this.dialog.close(state);
  }

}
