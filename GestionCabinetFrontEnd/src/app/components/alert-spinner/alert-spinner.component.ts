import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-spinner',
  templateUrl: './alert-spinner.component.html',
  styleUrls: ['./alert-spinner.component.css']
})
export class AlertSpinnerComponent {
  @Input()
  loadingSpinner!:boolean;
  @Input()
  lblLoadingText!:string;
  @Input()
fontSize!: any;

}
