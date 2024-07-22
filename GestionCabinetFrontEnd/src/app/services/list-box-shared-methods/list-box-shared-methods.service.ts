import { EventEmitter, Injectable } from '@angular/core';
import { SharedMethodsService } from '../shared-methods/shared-methods.service';
declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class ListBoxSharedMethodsService {
  public removeListBox: EventEmitter<any> = new EventEmitter<any>();
  public listBoxChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private sharedMethodService:SharedMethodsService) { }

  selectedValueListBox(compId: any, CompType: any): any {
    var listBox = this.sharedMethodService.callKendoComponent(compId, CompType);
    return listBox.select().text();
  }
  reorderListBox(e: {
    preventDefault: () => void;
    sender: { dataSource: any; dataItems: () => any };
    dataItems: any[];
    offset: any;
  }) {
    e.preventDefault();
    var dataSource = e.sender.dataSource;

    var dataItem = e.dataItems[0];
    var index = dataSource.indexOf(dataItem) + e.offset;
    dataSource.remove(dataItem);
    dataSource.insert(index, dataItem);
    var data = dataSource.data();
    var firstItemId = data[0].id;
  }
  initializelistBoxComp(compoId: any,dataTextField:any,dataValField:any,selectableType:any,toolBarMenu:any[],connectedWith:any,dataSource:any[],draggable:any,template:any) {
    $(`#${compoId}`)
      .kendoListBox({
        connectWith: connectedWith,
        dataSource: {
          data: dataSource,
        },
        selectable: selectableType,
        dataTextField: dataTextField,
        dataValueField: dataValField,
        toolbar: {
          tools: toolBarMenu,
        },
        draggable:draggable,
        template:template,
       reorder: this.reorderListBox.bind(this),
       remove:(e: any) => this.removeListBox.emit(e),
       change: (e: any) => this.listBoxChange.emit(e),

      })
      .data('kendoListBox');
  }
  emptyKendoListBox(listBoxId: any,listBoxType:any) {
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType);
    listBox.dataSource.data([]);
  }
  SelectAllListBox(listBoxId: any,listBoxType:any) {
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType);
    // Get all items and select them
    if(listBox.dataSource._data.length!=0){
  listBox.select(listBox.items());
    }

  }
  UnselectAllListBox(listBoxId: any,listBoxType:any) {
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType);
    // Unselect all items
  listBox.clearSelection();

  }
  getItemsListBox(listBoxId: any,listBoxType:any):any[] {
    var dataItems = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType).dataItems();
    return dataItems;
  }
  checkIfListBoxIsEmpty(listBoxId: any,listBoxType:any){
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType);
      return listBox.dataItems().length === 0?true:false;
  }
  chkeckExistanceItemsListBox(itemSearched: any, listBoxResult: any,valItem:any): any {
    var isExist = false;
    listBoxResult.dataItems().map((item: any) => {
      if (item[valItem] == itemSearched) {
        isExist = true;
        return;
      }
    });
    return isExist;
  }
  selectedItemListBox(listBoxId: any,listBoxType:any): any {
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType);
    return listBox.dataItem(listBox.select());
  }
  getLengthDataListBox(listBoxId: any): any {
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,'kendoListBox');
    return listBox.dataSource.data().length;
  }
  selectedMultipleItemsListBox(listBoxId: any,listBoxType:any,text:any): any[] {
    var selectedDataItems:any[]=[];
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType);
    var selectedItems = listBox.select();
    selectedItems.toArray().map((item: any) => {
      var dataItem = listBox.dataItem(item);
      selectedDataItems.push(dataItem[text]);
     })
    return  selectedDataItems;
  }
  selectedFullMultipleDataItemsListBox(listBoxId: any,listBoxType:any): any[] {
    var selectedDataItems:any[]=[];
    var listBox = this.sharedMethodService.callKendoComponent(listBoxId,listBoxType);
    var selectedItems = listBox.select();
    selectedItems.toArray().map((item: any) => {
      var dataItem = listBox.dataItem(item);
      selectedDataItems.push(dataItem);
     })
    return  selectedDataItems;
  }

}
