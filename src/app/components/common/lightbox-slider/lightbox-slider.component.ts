import { Component, OnDestroy, OnInit, Inject, AfterViewInit } from '@angular/core';
import SwiperCore, { Navigation, A11y, Swiper, Zoom,Lazy } from 'swiper/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
SwiperCore.use([Navigation, A11y, Zoom,Lazy]);


@Component({
  selector: 'app-lightbox-slider',
  templateUrl: './lightbox-slider.component.html',
  styleUrls: ['./lightbox-slider.component.scss']
})
export class LightboxSliderComponent implements OnInit,AfterViewInit ,OnDestroy {
  slider: any;

  constructor(
    public dialogRef: MatDialogRef<LightboxSliderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    this.initSlider();
  }

  initSlider(): void {
    this.slider = new Swiper('#image-slider', {
      slidesPerView: 1,
      initialSlide:this.data.index,
      // loop: true,
      zoom: true,
      preloadImages: false,
      lazy:true,
      navigation: {
        nextEl: '.action-holders .prev',
        prevEl: '.action-holders .next',
      }
    });
  }

  ngOnDestroy(): void {
    console.log('destroyed');
    this.slider.destroy();
  }

}
