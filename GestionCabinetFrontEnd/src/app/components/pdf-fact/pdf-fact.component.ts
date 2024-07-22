import { ListBoxSharedMethodsService } from './../../services/list-box-shared-methods/list-box-shared-methods.service';
import { FactureService } from './../../services/facture/facture.service';
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
import { AddFactureRequest } from 'src/app/models/api-model/fact/AddFactureRequest.model';
import { factureResponse } from 'src/app/models/api-model/fact/factResponse.model';
import { updatedFactureRequest } from 'src/app/models/api-model/fact/updateFactRequest.model';
import { patientResponse } from 'src/app/models/api-model/patient/patient-response.model';
import { RendezVousService } from 'src/app/services/Rdv/rendez-vous.service';
import { ConsultService } from 'src/app/services/consultation/consult.service';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';
declare const kendo: any; // Declare kendo to avoid TypeScript errors
declare const $: any;
@Component({
  selector: 'app-pdf-fact',
  templateUrl: './pdf-fact.component.html',
  styleUrls: ['./pdf-fact.component.css']
})
export class PdfFactComponent implements OnInit, AfterViewInit, OnDestroy  {
  factureViewed!: factureResponse;
patient: patientResponse={
  Id: '',
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  phoneNumber: '',
  birthday: new Date(),
  address: '',
  chronicDiseases: '',
  city: '',
  job: '',
  marriedSituation: '',
  sexe: ''
};
listCons!:ConsultationResponse[];
currentDateTime!: Date;

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
private factService: FactureService) {


  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
    this.factureViewed = this.sharedService.facture;
    console.log("xxxxxxxx",this.factureViewed);
    this.getPatientByConsultation();
    this.currentDateTime = new Date(); // Initialize with current date and time
    this.getListConsultations();
  }
  getPatientByConsultation(){
    this.patientService.getPatientByFactrId(this.factureViewed.id).subscribe({
      next: (successResponse) => {
        this.patient=successResponse;
        console.log("yyyyyyyyyyyyyyy", this.patient);

      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });

  }

getListConsultations(){
  this.consltService.getConsByFactId(this.factureViewed.id).subscribe({
    next: (successResponse) => {
      this.listCons = successResponse;
      console.log('list consultation',successResponse);
      this.InitializeGrid();
    },
    error: (errorResponse) => {
      console.log(errorResponse);
    },
  });
}
InitializeGrid() {
  $('#grid-cons')
     .kendoGrid({
       dataSource: {
         data: this.listCons,
         schema: {
           model: {
             uid: 'id',
             fields: {
               id: { type: 'string' },
               titre: { type: 'string' },
               dateConsultation:{ type: 'Date' },
               etatCons : { type: 'string' },
               fraisCons : { type: 'number' },
             },
           },
         },
         aggregate: [
          { field: 'fraisCons', aggregate: 'sum' },
          { field: 'titre', aggregate: 'count' } // Define the aggregate for 'titre'
          // Define the aggregate for 'fraisCons'
        ],
       },
       selectable: 'row',
       columns: this.prepareColumnGrid(),
       groupable: false,
       filterable: true,
       sortable: true,
       navigatable: true,
        resizable: true,
       reorderable: true,
       columnMenu: true,
     })
     .data('kendoGrid');
 }
 prepareColumnGrid(): any[] {
  return [
   // { field: 'titre', title: 'Titre' ,width: "100px"},
   {
    field: 'titre',
    title: 'Title',
    width: '100px',
    aggregates: ['count'], // Define aggregates for the column
    footerTemplate: 'nbr Cons: #=count#' // Template to display the count
  },
    { field: 'dateConsultation', title: 'Consultation date', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
    { field: 'etatCons', title: 'Cons status',width: "100px" },
    {
      field: 'fraisCons',
      title: 'Cons Fees',
      width: '100px',
      aggregates: ['sum'], // Define aggregates for the column
      footerTemplate: 'Total: #=sum#' // Template to display the total sum
    },
  //  { field: 'fraisCons', title: 'fraisCons',width: "100px" },

  ];
}
getPDF(a:any){
  kendo.drawing.drawDOM($(a)).then(function (group:any) {
    kendo.drawing.pdf.saveAs(group, "invoice.pdf");
  });}

}
