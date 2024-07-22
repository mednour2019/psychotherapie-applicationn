import { EventEmitter, Injectable } from '@angular/core';
import { GridSharedMethodsService } from '../grid-shared-service/grid-shared-methods.service';
import { SharedMethodsService } from '../shared-methods/shared-methods.service';
declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class KendoDialogSharedMethodsService {
  public FillSelectionDialogInputs: EventEmitter<any> = new EventEmitter<any>();
  public kendoWindowClose: EventEmitter<any> = new EventEmitter<any>();
  constructor( private sharedGridService:GridSharedMethodsService,
    private  sharedMethodervice:SharedMethodsService) { }
  cancelDialog(dialogComp: any) {
    $(`#${dialogComp}`).data('kendoDialog').close();
  }
  setConfigurationKendoDialog(compId: any ,width:any,height:any,title:any) {
    $(`#${compId}`).kendoDialog({
      visible: false,
      modal: true,
      title: title, // Set the title
      width: width+'px',
      height:height+'px',
      scrollable: true,

    });
  }
  openDialog(compId:any,gridId:any,GridType:any) {
    var dataItem =this.sharedGridService.selectedRowGrid(gridId,GridType);
    //this.FillSelectionDialogInputs(dataItem);
    this.FillSelectionDialogInputs.emit(dataItem);
    this.openCenteredDialog(compId);
  }
  openCenteredDialog(dlgComp: any) {
    var Dialog = $(`#${dlgComp}`).data('kendoDialog');
    Dialog.open();
  }
  closeKendoDialog(kendoDialogId:any,kendoDialogType:any) {
    var dialogComKendo = $(`#${kendoDialogId}`); // Replace with your window element selector
    if (dialogComKendo && dialogComKendo.data(kendoDialogType)) {
     // $(`#${kendoDialogId}`).data('kendoDialog').close();
      this.sharedMethodervice.callKendoComponent(kendoDialogId,kendoDialogType).close();
      dialogComKendo.data(kendoDialogType).destroy();
    }
  }


  setConfigurationKendoWindow(compId: any ,width:any,height:any,title:any,actions:any[]) {
    $(`#${compId}`).kendoWindow({
      visible: false,
      title: title, // Set the title
      width: width+'px',
      height:height+'px',
      scrollable: true,
      actions: actions,
      resizable: false,
      modal:false,
      close: (e: any) => this.kendoWindowClose.emit(e)
    });
  }
  openCenteredWindow(dlgComp: any) {
    var window= $(`#${dlgComp}`).data('kendoWindow').center().open();
    window.open();
  }
  cancelWindow(dialogComp: any) {

    $(`#${dialogComp}`).data('kendoWindow').close();
  }

}
