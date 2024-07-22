import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-generic-checkboxgroup',
  templateUrl: './generic-checkboxgroup.component.html',
  styleUrls: ['./generic-checkboxgroup.component.css']
})
export class GenericCheckboxgroupComponent implements OnInit, AfterViewInit {

  @Input()
  listMeasDimCalc!: any[] ;
  @Input()
  filteredListMeasDimCal: any[] = [];
  @Input() attributeMeasDimCalClass!: string ;
  @Input() labelItemMeasDimCalcShowing: string | undefined;
  @Input() iconLabel: string | undefined;
  @Output() selectedCountChange: EventEmitter<number> = new EventEmitter<number>();

  filterText: string = '';
  selectAllCheckbox: boolean = false;
  selectedCount:number=0;
// Define an @Input property to receive the click event function
  @Input()

  checkedMeasDimCalc: any[]=[];
  @Output() checkedMeasDimCalcSender: EventEmitter<any[]> = new EventEmitter<any[]>();


  ngAfterViewInit(): void {
  }
  ngOnInit(): void {

  }
  updateSelectedCount() {


   this.selectedCount = this.filteredListMeasDimCal.filter((item) => item.selected).length;
    this.selectedCountChange.emit(this.selectedCount);
    this.checkedMeasDimCalc = this.filteredListMeasDimCal.filter(item => item.selected).map(item => item/*[this.attributeMeasDimCalClass]*/);
    this.checkedMeasDimCalcSender.emit(this.checkedMeasDimCalc);

  }

  selectAllItems(checked: boolean) {
    this.filteredListMeasDimCal.forEach((item) => {
      item.selected = checked;
    });
    this.updateSelectedCount();
  }

  applyFilter() {

    this.filteredListMeasDimCal = this.listMeasDimCalc.filter((item) =>
      item[this.attributeMeasDimCalClass].toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

}
