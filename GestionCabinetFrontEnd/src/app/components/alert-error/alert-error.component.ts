import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.component.html',
  styleUrls: ['./alert-error.component.css']
})
export class AlertErrorComponent {
  @Input()
  ctrlValidDisplay!:boolean;
  @Input()
  msgErrValid!: any;
  /*@Input()
  timeOut!: number;*/
  @Input()
  classAlert!: any;
  @Input()
  classWarning!: string;
 /* showError() {
    //this.ctrlValidDisplay = true;
    setTimeout(() => {
      this.ctrlValidDisplay = false;
    },this.timeOut); // 3000 milliseconds (3 seconds)
  }*/


}
