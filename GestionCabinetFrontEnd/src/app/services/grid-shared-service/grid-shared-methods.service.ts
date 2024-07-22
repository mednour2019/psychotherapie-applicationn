import { Injectable } from '@angular/core';
import { SharedMethodsService } from '../shared-methods/shared-methods.service';
declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class GridSharedMethodsService {

  constructor(
    private sharedMethodService:SharedMethodsService
    ) { }

  selectAutomaticallyRowInGrid(e:any){
    var row = $(e.target).closest("tr");
    var grid = row.closest(".k-grid").data("kendoGrid");
    grid.select(row);

  }
  selectedRowGrid(gridId:any,gridType:any):any{
    var grid = this.sharedMethodService.callKendoComponent(gridId, gridType);
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
    return dataItem;

  }
}
