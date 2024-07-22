import { EventEmitter, Injectable } from '@angular/core';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { StatisticsComponent } from 'src/app/components/private/statistics/statistics.component';
import { GridSharedMethodsService } from '../grid-shared-service/grid-shared-methods.service';
import { BehaviorSubject } from 'rxjs';

declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class SharedMethodsService {


  newPosition = {
    field: 'position',
    title: 'Position',
    columns: null,
    width: "150px"
  };
  constructor( private snackbar:MatSnackBar ) { }
  tranformdat(daten:Date):any{
    var year = daten.getFullYear();
    var month = (daten.getMonth() + 1).toString().padStart(2, '0');
   var day = daten.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


  initializekendoMultiSelectComp(compoId: any,dataTextField:any,dataValField:any,placeHolder:any) {
    $(`#${compoId}`).kendoMultiSelect({
      dataTextField: dataTextField,
      dataValueField: dataValField,
      filter: "contains",
      placeholder: placeHolder,
      downArrow: true,

  });
  }
  destroyComp(compId:any,isNull:any){
    isNull?$(`#${compId}`).css('display', 'none'):$(`#${compId}`).css('display', '');


  }
  showSnackbar(message:any,action:any,panelClass:any) {
    // Customize snackbar appearance and behavior
    var config: MatSnackBarConfig = {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top', // 'top' | 'bottom'
      panelClass:panelClass,

    };
    this.snackbar.open(message, action, config);

  }


 setWidthHeightKendoCom(compId: any, comType: any, width: any, height: any) {
  var KendoComp = this.callKendoComponent(compId, comType);
  // Set the width and height
  KendoComp.wrapper.css({
    width: width + 'px', // Set the desired width
    height: height + 'px', // Set the desired height
  });
}
callKendoComponent(compId: any, compType: any): any {
  return $(`#${compId}`).data(compType);
}
populateKendoComponent(olapCubeNames:any[],compId:any,compType:any): void {
  var olapCube = this.callKendoComponent(compId, compType);
  olapCube.setDataSource(olapCubeNames);
}

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


getDataSourceTreeList(compId:any,compType:any):any[]{
  var treeList= this.callKendoComponent(compId,compType);
  var dataSource = treeList.dataSource._data;
  return dataSource;

}

prepareColumnReport(colSmartGrid:any[],listKpi:any[]):any[]{

    colSmartGrid=listKpi.map((kpi: string) => {
      return {
        field: this.cleanSpecCharDec(kpi),
        title: kpi,
        columns: null,
        width: "150px",
       // format: "{0:p}"
      };
    });
    colSmartGrid.unshift(this.newPosition);

  return colSmartGrid;

}

cleanSpecCharDec(columnName: string): string {
  let resultColumn = columnName;
  const regex = new RegExp('[\\s\\W]+', 'g');
  if (regex.test(columnName)) {
    resultColumn = columnName.replace(regex, '_');
  }
  if (/^\d/.test(columnName)) {
    resultColumn = `_${columnName}`;
  }

  return resultColumn;
}





}
