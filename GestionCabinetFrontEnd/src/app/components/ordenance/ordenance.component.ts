import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar,MatSnackBarConfig} from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { AddRendezVousRequest } from 'src/app/models/api-model/Rdv/AddRendezVousRequest.model';
import { RendezVousResponse } from 'src/app/models/api-model/Rdv/RendezVousResponse.model';
import { UpdatedRendezVousRequest } from 'src/app/models/api-model/Rdv/UpdatedRendezVousRequest.model';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { AddConsultationRequest } from 'src/app/models/api-model/consultation/AddConsultationRequest.model';
import { ConsultationResponse } from 'src/app/models/api-model/consultation/ConsultationResponse.model';
import { UpdatedConsultationRequest } from 'src/app/models/api-model/consultation/UpdatedConsultationRequest.model';
import { AddOrdenRequest } from 'src/app/models/api-model/ordenance/AddOrdenanceRequest.model';
import { OrdenResponse } from 'src/app/models/api-model/ordenance/ordenResponse.model';
import { UpdatedOrdenRequest } from 'src/app/models/api-model/ordenance/updateOrdenRequest.model';
import { patientResponse } from 'src/app/models/api-model/patient/patient-response.model';
import { RendezVousService } from 'src/app/services/Rdv/rendez-vous.service';
import { ConsultService } from 'src/app/services/consultation/consult.service';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { OrdenanceService } from 'src/app/services/ordenance/ordenance.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';
declare const $: any;
@Component({
  selector: 'app-ordenance',
  templateUrl: './ordenance.component.html',
  styleUrls: ['./ordenance.component.css']
})
export class OrdenanceComponent implements OnInit, AfterViewInit, OnDestroy {
  routerSubscription: any;
  loadingGridRdv=false;
  lblloadingGrid='Please wait while the data is loading!';
  listOrd!: OrdenResponse[];
  listPat!: patientResponse[];
  ordToAdd:AddOrdenRequest={
    dateCreation: new Date(),
    emmetteur: '',
    description: '',
    dateValidité: new Date(),
    suiviRecomm: '',
    isRemoved: 0,
    userId: ''
  };
  ordToUpdate:UpdatedOrdenRequest={
    Id: '',
    dateCreation: new Date(),
    emmetteur: '',
    description: '',
    dateValidité: new Date(),
    suiviRecomm: ''
  };
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('addOrd', { static: false }) addOrd!: ElementRef;
//control saisie
emmetInput:string="";
descInput:string="";
suiviRecInput:string="";
comb:any;
selectedPatId:string="";
isModeAdd = true;
idVirtualOrd:string='';
///////
constructor(private router: Router,
  private snackbar: MatSnackBar,
  private sharedService: SharedService,
  private sharedMethodService:SharedMethodsService,
  private kendoDialogSharedService: KendoDialogSharedMethodsService,
  private sharedGridService:GridSharedMethodsService,
  private kendoChartService: KendoChartService,
  private buttonStateService:SharedService,
 private kendoDialogMethodService:KendoDialogSharedMethodsService,
 private DropDownMethodService:DropDownSharedMethodsService,
 private kendoGridMethodService:GridSharedMethodsService,
 private rdvService:RendezVousService,
 private patientService:PatientService,
private consltService: ConsultService,
private ordService:OrdenanceService) {

}
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
    $("#datepicker").kendoDatePicker({
      format: "MM/dd/yyyy HH:mm:ss", // Date and time format
      value: new Date(), // Initial date value
      dateInput: true // Allow manual input of dates
  });
  this.kendoDialogMethodService.setConfigurationKendoDialog(
    'addDialog',
    1150,
    600,
    'add prescription'
  );
  this.kendoDialogMethodService.setConfigurationKendoDialog(
    'deleteDialog',
    600,
    300,
    'delete prescription'
  );
  this.comb = $("#list-patients").kendoMultiColumnComboBox({
    dataTextField: "firstName",
    dataValueField: "firstName",
    height: 400,
    columns: [
        {   field: "firstName", title: "patient name", width: 200},
        { field: "lastName", title: "patient last name", width: 200 },
        { field: "userName", title: "user name", width: 200 },
        { field: "email", title: "email", width: 200 }
    ],
    select:this.selectedPatient.bind(this), //function(e:any) {
     // var selectedItem = this.dataItem(e.item.index());
     // this.selectedPatientId=selectedItem.id;
     // console.log("secletd itemmmmm",selectedItem.id);
 // },
    filter: "contains",
    filterFields: ["firstName", "lastName", "lastName", "email"],
}).data("kendoMultiColumnComboBox");

  }
  selectedPatient(e:any){
    console.log("secletd itemmmmm",e);
    this.selectedPatId=e.dataItem.id;
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
    this.getListOrde();
    this.getListPatients();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this.kendoDialogMethodService.closeKendoDialog(
          'addDialog',
          'kendoDialog'
        );
        this.kendoDialogMethodService.closeKendoDialog(
          'deleteDialog',
          'kendoDialog'
        );

      }
    });
  }
  getListPatients(){
    var droDowpatients = this.sharedMethodService.callKendoComponent(
      'list-patients',
      'kendoMultiColumnComboBox'
    );
    this.patientService.GetListPatients().subscribe({
      next: (successResponse) => {
        this.listPat = successResponse;
       // console.log('list patients',successResponse);
        this.comb.setDataSource(  this.listPat);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  getListOrde(){
    this.loadingGridRdv= true;
    this.ordService.GetListOrde().subscribe({
      next: (successResponse) => {
        this.loadingGridRdv = false;
        this.listOrd = successResponse;
        console.log('list consultation',successResponse);
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        this.loadingGridRdv = false;
        console.log(errorResponse);
      },
    });
  }
  InitializeGrid() {
    $('#gridOrd')
       .kendoGrid({
         dataSource: {
           data: this.listOrd,
           schema: {
             model: {
               uid: 'id',
               fields: {
                 id: { type: 'string' },
                 emmetteur: { type: 'string' },
                 dateCreation:{ type: 'Date' },
                 dateValidité:{ type: 'Date' },
                 description: { type: 'string' },
                 suiviRecomm: { type: 'string' },
                 firstNameUser: { type: 'string' },
                 lastNameUser : { type: 'string' },
               },
             },
           },
         },
         selectable: 'row',
         columns: this.prepareColumnGrid(),
         pageable: {
           refresh: false,
           pageSizes: true,
           buttonCount: 5,
         },
         groupable: true,
         filterable: true,
         toolbar: ["excel", "pdf",
         {
          name: 'custom',
          template:this.addOrd.nativeElement.innerHTML
        },
         ],
         sortable: true,
         navigatable: true,
          resizable: true,
         reorderable: true,
         columnMenu: true,
       })
       .data('kendoGrid');
       $('#gridOrd').on('click', '.k-grid-add', () => {
        this.isModeAdd = true;
        $("#addDialog").data("kendoDialog").title("Add prescription");
        this.openDialogAdd();
        console.log("opened");
      });
        //handle remove event
    $('#gridOrd').on('click', '.k-grid-remove', (e:any) => {
       this.sharedGridService.selectAutomaticallyRowInGrid(e);
       this.kendoDialogSharedService.openCenteredDialog('deleteDialog');

     });
       // handle edit event
      $('#gridOrd').on('click', '.k-grid-edit', (e: any) => {
        this.isModeAdd = false;
     this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
     $("#addDialog").data("kendoDialog").title("Edit prescription");
      this.openDialogAdd();

       });


   }
   prepareColumnGrid(): any[] {
    return [
      { field: 'emmetteur', title: 'issuer' ,width: "100px"},
      { field: 'dateCreation', title: 'Creation date', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'description', title: 'Description',width: "300px" },
      { field: 'dateValidité', title: 'Validity date', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'suiviRecomm', title: 'recommendation follow-up',width: "300px" },
     // { field: 'anctecMedical', title: 'anctecedant Medical',width: "100px" },
      { field: 'firstNameUser', title: 'patient name',width: "100px" },
      { field: 'lastNameUser', title: 'patient last name',width: "100px" },
      {
        title: 'Actions',
        template: this.myDivElement.nativeElement.innerHTML,
        width: "150px"
      },
    ];
  }
  cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
  openDialogAdd() {
    if (this.isModeAdd ==false) {
      var grid = this.sharedMethodService.callKendoComponent('gridOrd', 'kendoGrid');
      var selectedRow = grid.select();
        var dataItem = grid.dataItem(selectedRow);
        this.clearOrFillSelectionDialogInputs(dataItem);
        this.kendoDialogMethodService.openCenteredDialog('addDialog');
    } else {
      this.clearOrFillSelectionDialogInputs({});
      this.kendoDialogMethodService.openCenteredDialog('addDialog');
    }
  }
  clearOrFillSelectionDialogInputs(dataItem: any) {
    var listPatient = this.sharedMethodService.callKendoComponent(
      'list-patients',
      'kendoMultiColumnComboBox'
    );
    console.log("itemmmm",this.isModeAdd);
  this.emmetInput=this.isModeAdd==true ?'' : dataItem.emmetteur;
    this.descInput=this.isModeAdd==true ?'' : dataItem.description;
   this.suiviRecInput=this.isModeAdd==true ?'' : dataItem.suiviRecomm;
    this.isModeAdd? $("#datepicker").data("kendoDatePicker").value(""): $("#datepicker").data("kendoDatePicker").value(dataItem.dateValidité);
    this.idVirtualOrd=this.isModeAdd==true ?'' : dataItem.id;
    console.log("itemmmmichrakkkkkkk",dataItem.firstName);
    listPatient.value(this.isModeAdd==true ? '' :dataItem.firstNameUser);

  }
  saveRecord() {

        if(this.isModeAdd==true)
          {
            this.ordToAdd={
              emmetteur:this.emmetInput,
              dateValidité:$(`#datepicker`).data("kendoDatePicker").value(),
              description:this.descInput,
              suiviRecomm:this.suiviRecInput,
              userId:this.selectedPatId,
              isRemoved:0,
              dateCreation:new Date()
            }
            this.ordService.AddOrd(this.ordToAdd).subscribe({
              next: (successResponse) => {
                console.log('added cons ', successResponse);
              this.kendoDialogSharedService.cancelDialog('addDialog');
                this.sharedMethodService.showSnackbar(
                  'prescription added successfully',
                  'Success',
                  'succ-snackbar'
                );
                this.getListOrde();
              },
              error: (errorResponse) => {
                console.log(errorResponse);
                this.kendoDialogSharedService.cancelDialog('addDialog');
                this.sharedMethodService.showSnackbar(
                  'Error conatct admin',
                  'Error!',
                  ''
                );
              },
            })
          }
          else{
            this.ordToUpdate={
              Id:this.idVirtualOrd,
              dateValidité:$(`#datepicker`).data("kendoDatePicker").value(),
              description:this.descInput,
              emmetteur:this.emmetInput,
              suiviRecomm:this.suiviRecInput,
              dateCreation:new Date()
            }
            this.ordService.UpdateOrd(this.ordToUpdate).subscribe({
              next: (successResponse) => {
                console.log('update cons ', successResponse);
              this.kendoDialogSharedService.cancelDialog('addDialog');
                this.sharedMethodService.showSnackbar(
                  'prescription modified successfully',
                  'Success',
                  'succ-snackbar'
                );
                this.getListOrde();
              },
              error: (errorResponse) => {
                console.log(errorResponse);
                this.kendoDialogSharedService.cancelDialog('addDialog');
                this.sharedMethodService.showSnackbar(
                  'Error contact Admin',
                  'Error!',
                  ''
                );
              },
            })
          }

        }
        removeRecord() {
          var dataItem= this.sharedGridService.selectedRowGrid('gridOrd', 'kendoGrid');
           this.ordService.RemoveOrd(dataItem.id).subscribe({
             next: (successResponse) => {
               console.log('isRemoved', successResponse);
               this.kendoDialogSharedService.cancelDialog("deleteDialog");
               this.sharedMethodService.showSnackbar(
                 'prescription deleted successfully',
                 'Success',
                 'succ-snackbar'
               );
               this.getListOrde();
             },
             error: (errorResponse) => {
               this.kendoDialogSharedService.cancelDialog("deleteDialog");
               this.sharedMethodService.showSnackbar(
                 'Error contact Admin',
                 'Error!',
                 ''
               );
               console.log(errorResponse);
             },
           })
       }
}
