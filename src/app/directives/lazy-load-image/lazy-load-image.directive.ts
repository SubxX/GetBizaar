import { Directive ,ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appLazyLoadImage]'
})
export class LazyLoadImageDirective {
  @HostListener('load', ['$event'])
  imageLoaded(e: any) {
      this.elm.nativeElement.classList.add('loaded');
  }

  constructor(public elm:ElementRef<HTMLImageElement>) {
    this.interSec(this.elm.nativeElement);
  }

  interSec(tg):void{
    const observer = new IntersectionObserver((ent, obs) => {
      ent.forEach((item) => {
        if (item.isIntersecting) {
          item.target.setAttribute('src',item.target.getAttribute('data-src'));
          observer.disconnect();
        }
      })
    },{threshold:0.5});
    observer.observe(tg);
  }

}
// (load)="img.classList.add('loaded')"
