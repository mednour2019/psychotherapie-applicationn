import { EventEmitter, Injectable } from '@angular/core';
import { SharedMethodsService } from '../shared-methods/shared-methods.service';
declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class DropDownSharedMethodsService {
  dropDownSearchLabelDataMart='Data Source';
  public dropdownChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private sharedMethodService:SharedMethodsService) { }
  initializeDropDownComp(compoId: any,searchLabel:any,dataTextField:any,dataValField:any) {
    $(`#${compoId}`).kendoDropDownList({
      filter: 'contains',
      optionLabel: searchLabel,
      dataTextField: dataTextField,
      dataValueField: dataValField,
      //change:this.changeDropDownList.bind(this),
      change: (e: any) => this.dropdownChange.emit(e),

    });
  }
  selectedValueDropDownList(compId: any, CompType: any): any {
    var dropDownList = this.sharedMethodService.callKendoComponent(compId, CompType);
    return dropDownList.value();
  }


}
