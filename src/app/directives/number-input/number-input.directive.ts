import { Directive , Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[appNumberInput]'
})
export class NumberInputDirective {
  @Output() increment:EventEmitter<any> = new EventEmitter<any>();
  @Output() decrement:EventEmitter<any> = new EventEmitter<any>();

  @HostListener('click',['$event.target'])
  clicked(ev){
    if(ev.classList.contains('dd-up')){
      this.increment.emit();
    }
    if(ev.classList.contains('dd-down')){
      this.decrement.emit();
    }
  }

  constructor() {
  }

}
