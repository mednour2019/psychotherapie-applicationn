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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
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

declare const $: any;
@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css'],
})
export class FactureComponent implements OnInit, AfterViewInit, OnDestroy {
  routerSubscription: any;
  loadingGridFactr = false;
  lblloadingGrid = 'Please wait while the data is loading!';
  listFact!: factureResponse[];
  factrToAdd: AddFactureRequest = {
    dateCreation: new Date(),
    description: '',
    adressCabinet: '',
    matrFiscCabinet: '',
    isRemoved: 0,
    ConsultationIds: [],
    etatCons: '',
  };
  factrToUpdate: updatedFactureRequest = {
    id: '',
   // dateCreation: new Date(),
    description: '',
    adressCabinet: '',
    matrFiscCabinet: '',
  };
  factrToVisualize: factureResponse = {
    id: '',
    dateCreation: new Date(),
    description: '',
    adressCabinet: '',
    matrFiscCabinet: '',
  };
  patient: patientResponse = {
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
    sexe: '',
  };
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('addFactr', { static: false }) addFactr!: ElementRef;
  combPatient: any;
  gridConsPyPatient: any;
  isModeAdd = true;
  idVirtualFactr: string = '';
  dropDownSearchLabel = 'please select fields...';
  selectedPatientId: string = '';
  listConsNonPayer!: ConsultationResponse[];
  consultIds!: string[];

  // **vamlidation saise
  desFactInput: string = '';
  addresseInput: string = '';
  matFiscInput: string = '';
  ctrlValdDesc = false;
  ctrlValdAdrs = false;
  ctrlValdMatr = false;
  ctrlValdPat = false;
  ctrlValdCons = false;
  /////
  listPatients!: patientResponse[];
  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private sharedService: SharedService,
    private sharedMethodService: SharedMethodsService,
    private kendoDialogSharedService: KendoDialogSharedMethodsService,
    private sharedGridService: GridSharedMethodsService,
    private kendoChartService: KendoChartService,
    private buttonStateService: SharedService,
    private kendoDialogMethodService: KendoDialogSharedMethodsService,
    private DropDownMethodService: DropDownSharedMethodsService,
    private kendoGridMethodService: GridSharedMethodsService,
    private rdvService: RendezVousService,
    private patientService: PatientService,
    private consltService: ConsultService,
    private factService: FactureService
  ) {}
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'addDialog',
      1150,
      700,
      'add invoice'
    );
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'deleteDialog',
      600,
      300,
      'delete invoice'
    );
    this.combPatient = $('#list-patient')
      .kendoMultiColumnComboBox({
        dataTextField: 'firstName',
        dataValueField: 'firstName',
        height: 400,
        columns: [
          { field: 'firstName', title: 'firstName', width: 200 },
          { field: 'lastName', title: 'lastName', width: 200 },
          { field: 'lastName', title: 'userName', width: 200 },
          { field: 'email', title: 'email', width: 200 },
        ],
        select: this.selectedPatient.bind(this),
        filter: 'contains',
        filterFields: ['firstName', 'lastName', 'lastName', 'email'],
      })
      .data('kendoMultiColumnComboBox');
    this.gridConsPyPatient = $('#grid-cons-pat')
      .kendoGrid({
        dataSource: {
          schema: {
            model: {
              uid: 'id',
              fields: {
                id: { type: 'string' },
                dateConsultation: { type: 'Date' },
                titre: { type: 'string' },
                description: { type: 'string' },
                fraisCons: { type: 'number' },
                etatCons: { type: 'string' },
              },
            },
          },
        },
        selectable: 'multiple row',
        height: 200,
        width: 200,
        columns: this.prepColGridConsByPat(),
        sortable: true,
        navigatable: true,
        resizable: true,
        reorderable: true,
        columnMenu: true,
      })
      .data('kendoGrid');
  }
  selectedPatient(e: any) {
    console.log('secletd itemmmmm', e);
    this.selectedPatientId = e.dataItem.id;
    this.getConsNonPayerParPatient();
  }
  getConsNonPayerParPatient() {
    this.consltService
      .getConsNonPayerByPatient(this.selectedPatientId)
      .subscribe({
        next: (successResponse) => {
          // this.listCons = successResponse;
          console.log('list consultation', successResponse);
          this.listConsNonPayer = successResponse;
          this.gridConsPyPatient.setDataSource(this.listConsNonPayer);
        },
        error: (errorResponse) => {
          console.log(errorResponse);
        },
      });
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
    this.getListFactures();
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
  getListPatients() {
    var droDowpatients = this.sharedMethodService.callKendoComponent(
      'list-patient',
      'kendoMultiColumnComboBox'
    );
    this.patientService.GetListPatients().subscribe({
      next: (successResponse) => {
        this.listPatients = successResponse;
        // console.log('list patients',successResponse);
        this.combPatient.setDataSource(this.listPatients);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  getListFactures() {
    this.loadingGridFactr = true;
    this.factService.GetListFacture().subscribe({
      next: (successResponse) => {
        this.loadingGridFactr = false;
        this.listFact = successResponse;
        console.log('list factures', successResponse);
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        this.loadingGridFactr = false;
        console.log(errorResponse);
      },
    });
  }
  prepareColumnGrid(): any[] {
    return [
      {
        field: 'dateCreation',
        title: 'dateCreation',
        format: '{0:dd/MM/yyyy HH:mm:ss}',
        width: '100px',
      },
      { field: 'description', title: 'Description', width: '200px' },
      { field: 'adressCabinet', title: 'Office Address', width: '100px' },
      { field: 'matrFiscCabinet', title: 'tax inv office', width: '100px' },

      {
        title: 'Actions',
        template: this.myDivElement.nativeElement.innerHTML,
        width: '150px',
      },
    ];
  }
  prepColGridConsByPat(): any[] {
    return [
      { field: 'titre', title: 'Title', width: '100px' },
      {
        field: 'dateConsultation',
        title: 'Consultation date',
        format: '{0:dd/MM/yyyy HH:mm:ss}',
        width: '100px',
      },
      { field: 'description', title: 'Description', width: '100px' },
      { field: 'etatCons', title: 'Cons status', width: '100px' },
      { field: 'fraisCons', title: 'consultation fees', width: '100px' },
    ];
  }
  InitializeGrid() {
    $('#gridFactr')
      .kendoGrid({
        dataSource: {
          data: this.listFact,
          schema: {
            model: {
              uid: 'id',
              fields: {
                id: { type: 'string' },
                dateCreation: { type: 'Date' },
                description: { type: 'string' },
                adressCabinet: { type: 'string' },
                matrFiscCabinet: { type: 'string' },
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
        toolbar: [
          'excel',
          'pdf',
          {
            name: 'custom',
            template: this.addFactr.nativeElement.innerHTML,
          },
        ],
        sortable: true,
        navigatable: true,
        resizable: true,
        reorderable: true,
        columnMenu: true,
      })
      .data('kendoGrid');
    $('#gridFactr').on('click', '.k-grid-add', () => {
      this.isModeAdd = true;
      $('#addDialog').data('kendoDialog').title('Add Invoice');
      this.openDialogAdd();
      console.log('opened');
    });
    //handle remove event
    $('#gridFactr').on('click', '.k-grid-remove', (e: any) => {
      this.sharedGridService.selectAutomaticallyRowInGrid(e);
      this.kendoDialogSharedService.openCenteredDialog('deleteDialog');
    });
    // handle edit event
    $('#gridFactr').on('click', '.k-grid-edit', (e: any) => {
      this.isModeAdd = false;
      this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
      $('#addDialog').data('kendoDialog').title('Edit invoice');
      this.openDialogAdd();
    });
    $('#gridFactr').on('click', '.k-grid-visualize', (e: any) => {
      this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
      this.visualizeFacture();
    });
  }
  visualizeFacture() {
    var grid = this.sharedMethodService.callKendoComponent(
      'gridFactr',
      'kendoGrid'
    );
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
    this.factrToVisualize = {
      id: dataItem.id,
      dateCreation: dataItem.dateCreation,
      description: dataItem.description,
      adressCabinet: dataItem.adressCabinet,
      matrFiscCabinet: dataItem.matrFiscCabinet,
    };
    this.sharedService.setFactrToView(this.factrToVisualize);
    this.router.navigate(['/dashboard/pdf-fctr']);
  }
  openDialogAdd() {
    if (this.isModeAdd == false) {
      var grid = this.sharedMethodService.callKendoComponent(
        'gridFactr',
        'kendoGrid'
      );
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
    var gridCons = this.sharedMethodService.callKendoComponent(
      'grid-cons-pat',
      'kendoGrid'
    );
    var listPat = this.sharedMethodService.callKendoComponent(
      'list-patient',
      'kendoMultiColumnComboBox'
    );
    // console.log("itemmmm",this.isModeAdd);
    // console.log("factureeee",dataItem.id);
    //  console.log("ismode",this.isModeAdd);
    if (!this.isModeAdd) {
      this.getPatByFactId(dataItem.id);
    } else {
      listPat.value('');
    }
    //console.log("patient firstnameeee", this.patient.firstName);
    gridCons.setDataSource([]);
    this.desFactInput = this.isModeAdd == true ? '' : dataItem.description;
    this.addresseInput = this.isModeAdd == true ? '' : dataItem.adressCabinet;
    this.matFiscInput = this.isModeAdd == true ? '' : dataItem.matrFiscCabinet;
    this.idVirtualFactr = this.isModeAdd == true ? '' : dataItem.id;
    this.isModeAdd == true ? listPat.enable(true) : listPat.enable(false);

    if (this.isModeAdd == false) {
      //var grid = $("#grid").data("kendoGrid");
      gridCons.wrapper.find('*').prop('disabled', true); // Disable all elements inside the grid
      gridCons.wrapper.addClass('k-state-disabled'); // Add a disabled class for visual feedback
    } else {
      gridCons.wrapper.find('*').prop('disabled', true); // Disable all elements inside the grid
      gridCons.wrapper.removeClass('k-state-disabled'); // Add a disabled class for visual feedback
    }

    //$("#datepicker").data("kendoDatePicker").value("")
  }
  getPatByFactId(idfctr: any) {
    this.patientService.getPatientByFactrId(idfctr).subscribe({
      next: (successResponse) => {
        this.patient = successResponse;
        if (this.patient !== null) {
          var listPat = this.sharedMethodService.callKendoComponent(
            'list-patient',
            'kendoMultiColumnComboBox'
          );
          listPat.value(this.patient.firstName);
          console.log('patient', this.patient);
        } else {
          console.log('cette facture nest pas affecte a aucubne consultation');
        }
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }

  getSelectedConsId() {
    var grid = this.sharedMethodService.callKendoComponent(
      'grid-cons-pat',
      'kendoGrid'
    );
    var selectedRow = grid.select();
    var selectedDataItems: any[] = [];
    selectedRow.each(function (index: number, row: any) {
      var dataItem = grid.dataItem(row);
      selectedDataItems.push(dataItem.id);
    });
    this.consultIds = selectedDataItems;
  }
  showErrValdDesc() {
    this.ctrlValdDesc = true;
    setTimeout(() => {
      this.ctrlValdDesc = false;
    }, 3000);
  }
  showErrValdAdr() {
    this.ctrlValdAdrs = true;
    setTimeout(() => {
      this.ctrlValdAdrs = false;
    }, 3000);
  }
  showErrValdMatr() {
    this.ctrlValdMatr = true;
    setTimeout(() => {
      this.ctrlValdMatr = false;
    }, 3000);
  }
  showErrValdPat() {
    this.ctrlValdPat = true;
    setTimeout(() => {
      this.ctrlValdPat = false;
    }, 3000);
  }
  showErrValdCons() {
    this.ctrlValdCons = true;
    setTimeout(() => {
      this.ctrlValdCons = false;
    }, 3000);
  }
  controlValidationCompDialog(): any {
    var validItems = true;
    var gridPatients = this.sharedMethodService.callKendoComponent(
      'gridPatients',
      'kendoGrid'
    );
    if (this.addresseInput == '') {
      validItems = false;
      this.showErrValdAdr();
    }
    if (this.desFactInput == '') {
      validItems = false;
      this.showErrValdDesc();
    }
    if (this.matFiscInput == '') {
      validItems = false;
      this.showErrValdMatr();
    }
    if (this.isModeAdd == true) {
      if (
        this.DropDownMethodService.selectedValueDropDownList(
          'list-patient',
          'kendoMultiColumnComboBox'
        ) == ''
      ) {
        validItems = false;
        this.showErrValdPat();
      }
      console.log(
        'selected cons',
        this.sharedGridService.selectedRowGrid('grid-cons-pat', 'kendoGrid')
      );
      if (
        this.sharedGridService.selectedRowGrid('grid-cons-pat', 'kendoGrid') ==
        null
      ) {
        validItems = false;
        this.showErrValdCons();
      }
    }

    return validItems;
  }
  saveRecord() {
    if (this.controlValidationCompDialog()) {
      if (this.isModeAdd == true) {
        this.getSelectedConsId();
        this.factrToAdd = {
          description: this.desFactInput,
          adressCabinet: this.addresseInput,
          matrFiscCabinet: this.matFiscInput,
          isRemoved: 0,
          ConsultationIds: this.consultIds,
          dateCreation: new Date(),
          etatCons: 'pay',
        };
        this.factService.AddFacture(this.factrToAdd).subscribe({
          next: (successResponse) => {
            console.log('added facture ', successResponse);
            this.kendoDialogSharedService.cancelDialog('addDialog');
            this.sharedMethodService.showSnackbar(
              'invoice added successfully',
              'Success',
              'succ-snackbar'
            );
            this.getListFactures();
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
        });
      } else {
        this.factrToUpdate={
          id:this.idVirtualFactr,
          description:this.desFactInput,
          adressCabinet:this.addresseInput,
          matrFiscCabinet:this.matFiscInput
         }
         this.factService.UpdateFact(this.factrToUpdate).subscribe({
          next: (successResponse) => {
            console.log('update facture ', successResponse);
          this.kendoDialogSharedService.cancelDialog('addDialog');
            this.sharedMethodService.showSnackbar(
              'invoice modified successfully',
              'Success',
              'succ-snackbar'
            );
            this.getListFactures();
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
  }
  removeRecord() {
    var dataItem = this.sharedGridService.selectedRowGrid(
      'gridFactr',
      'kendoGrid'
    );
    this.factService.RemoveFact(dataItem.id).subscribe({
      next: (successResponse) => {
        console.log('isRemoved', successResponse);
        this.kendoDialogSharedService.cancelDialog('deleteDialog');
        this.sharedMethodService.showSnackbar(
          'invoice deleted successfully',
          'Success',
          'succ-snackbar'
        );
        this.getListFactures();
      },
      error: (errorResponse) => {
        this.kendoDialogSharedService.cancelDialog('deleteDialog');
        this.sharedMethodService.showSnackbar(
          'Error contact Admin',
          'Error!',
          ''
        );
        console.log(errorResponse);
      },
    });
  }
  cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
}
