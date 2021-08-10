import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { MainService } from '../../../services/main.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { takeUntil,take } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input() productData: any;
  @Input() editable: boolean;
  @Input() purchasable: boolean;
  @Input() purchasableBy:string;
  @Input() marketplaceId:string;
  @Input() method:string;
  @Output() changed:EventEmitter<Boolean> = new EventEmitter();
  @Output() getProductData:EventEmitter<any> = new EventEmitter();


  destroy: Subject<any> = new Subject();
  delMSg = { title: "You are about to delete a product",
  desc: "This will delete your product from the marketplace. Are you sure ?", btn: "Delete" };
  constructor(private main: MainService) { }

  ngOnInit(): void {
  }

  editProduct():void{
    this.getProductData.emit(this.productData);
  }

  openDetails(): void {
    this.main.openDialog(ProductDetailsComponent, '85%', '700px',
    {...this.productData,purchasable_by:this.purchasableBy,marketplace_id:this.marketplaceId,method:this.method})
  }

  deleteProduct(): void {
    this.main.openDialog(ConfirmationPopupComponent, '85%', '450px', this.delMSg)
      .afterClosed().pipe(take(1))
      .subscribe((data) => {
        if(data){this.changed.emit(true);}
       });
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
