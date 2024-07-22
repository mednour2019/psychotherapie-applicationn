import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-date-filter-period',
  templateUrl: './date-filter-period.component.html',
  styleUrls: ['./date-filter-period.component.css']
})

export class DateFilterPeriodComponent implements OnInit, AfterViewInit, OnDestroy {

  emptyDate=false;
  dateInvalid=false
  dateDiff=false
  msgErrorEmpty='Please DateStart / DateEnd is empty!';
  classAlertError='k-widget k-tooltip k-tooltip-validation k-invalid-msg';
  classWarningError='k-icon k-i-warning';
  @Input()
  startDate!:Date;
  @Input()
  endDate!:Date;
  @Input()
  idDatePickerStartDate!:any;
  @Input()
  idDatePickerEndDate!:any;
  @Input()
  idBtn!:any;
  constructor(private sharedService: SharedService)
  {

  }

  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {

  }
  displayReport(){
    if(this.checkFunctionnalityDate()){
      //this.displayReportEvent.emit();
      //this.sharedService.emitClickEvent();
      this.sharedService.emitDateChangeEvent(this.startDate, this.endDate,this.idBtn);

    }

  }
 /* tranformdat(daten:Date):any{
    var year = daten.getFullYear();
    var month = (daten.getMonth() + 1).toString().padStart(2, '0');
   var day = daten.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}*/
  checkFunctionnalityDate():any{
    var validate = true; // It's better to use camelCase for variable names in JavaScript/TypeScript

    // Check for null values first to avoid errors when accessing properties/methods
    if (this.startDate === null || this.endDate === null) {
        this.emptyDate = true;
        this.displayMsgError();
        setTimeout(() => {
            this.emptyDate = false;
        }, 3000);
        validate = false;
    } else if (this.startDate > this.endDate) {
        // If startDate is not null and endDate is not null, then we can safely compare
        this.dateInvalid = true; // Use camelCase for consistency
        this.displayMsgError();
        setTimeout(() => {
            this.dateInvalid = false;
        }, 3000);
        validate = false;
    } else {
        // Calculate monthDifference only if both dates are not null
        var monthDifference = (this.endDate.getFullYear() - this.startDate.getFullYear()) * 12 +
                              (this.endDate.getMonth() - this.startDate.getMonth());

        if (monthDifference > 2) {
            this.dateDiff = true; // Use camelCase for consistency
            this.displayMsgError();
            setTimeout(() => {
                this.dateDiff = false;
            }, 3000);
            validate = false;
        }
    }

    return validate;
  }
  displayMsgError(){
    if(this.emptyDate==true){
      this.msgErrorEmpty='Please DateStart / DateEnd is empty!';
    }
    else if (this.dateInvalid==true){
      this.msgErrorEmpty=' DateStart is superior of DateEnd!';

    }
    else{
      this.msgErrorEmpty='maximum period to display is 2 months! try to minimize it.';

    }


  }
}
