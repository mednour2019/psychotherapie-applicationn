import { Component, Input } from '@angular/core';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
declare const $: any;
@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.css']
})
export class InputFilterComponent {
  @Input()
  filterInput!: string;
  @Input()
  compId!: any;
  @Input()
  compType!: any;
  @Input()
  fieldText!: string;
  @Input()
  labelText!: string;
  @Input()
  nbItems!: number;
  @Input()
  classIconLabel!: any;
  @Input()
  remSelUnselClass!:boolean;
  @Input()
  widthSearchInput!:any;
  filterInputPlaceHolder=`Filter`
  constructor(
   private sharedListBoxServiceMethod: ListBoxSharedMethodsService

  ) {}
  applyFilterComponent(
    kendoCompId: string,
    kendoCompType: string,
    filterText: string,
    fieldText:any
  ) {
    var kendoComponent = $(`#${kendoCompId}`).data(kendoCompType);
    var filterValue = filterText.toLowerCase();
    kendoComponent.dataSource.filter({
      field: fieldText,
      operator: 'contains',
      value: filterValue,
    });
  }
  selectAllListBox(listBoxId: any) {

    this.sharedListBoxServiceMethod.SelectAllListBox(listBoxId, 'kendoListBox');
  }
  UnselectAllListBox(listBoxId: any) {
    this.sharedListBoxServiceMethod.UnselectAllListBox(
      listBoxId,
      'kendoListBox'
    );
  }
  /*emptyListBox(listBoxId: any) {
    this.sharedListBoxServiceMethod.emptyKendoListBox(
      listBoxId,
      'kendoListBox'
    );
   // this.nbItems=0;
   // this.nbFilteredCol = 0;
  }*/

}
