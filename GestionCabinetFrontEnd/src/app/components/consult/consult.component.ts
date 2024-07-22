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
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css'],
})
export class ConsultComponent implements OnInit, AfterViewInit, OnDestroy {
  routerSubscription: any;
  loadingGridRdv = false;
  lblloadingGrid = 'SVP patienter lors chargement du données!';
  listCons!: ConsultationResponse[];
  listRdvDispo!: RendezVousResponse[];
  consToAdd: AddConsultationRequest = {
    titre: '',
    dateConsultation: new Date(),
    description: '',
    evalMental: '',
    anctecMedical: '',
    isRemoved: 0,
    rdvId: '',
    fraisCons: 0,
    etatCons: '',
  };
  consToUpdate: UpdatedConsultationRequest = {
    Id: '',
    titre: '',
    dateConsultation: new Date(),
    description: '',
    evalMental: '',
    anctecMedical: '',
  };
  patientToDisplay: patientResponse = {
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
  @ViewChild('addCons', { static: false }) addCons!: ElementRef;
  // about control vali
  titreInput: string = '';
  ctrlValdtitre = false;
  msgErrorValdtitre = 'Please select title';
  ctrlValdateDescCons = false;
  msgErrorValdateCons = 'Please select consultation date!';
  DesconsInput: string = '';
  ctrlValdCons = false;
  msgErrorValdCons = 'Please enter description!';
  evalInput: string = '';
  anticInput: string = '';
  ctrlValdRdv = false;
  msgErrorValdRdv = 'Please select appointment';
  ctrvalevalcons = false;
  ctrvalevalAnctMedic = false;
  ctrlValdateCons = false;
  //************* */
  comb: any;
  selectedRdvId: string = '';
  isModeAdd = true;
  idVirtualCons: string = '';
  dropDownSearchLabel = 'Please select fields...!';

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
    private consltService: ConsultService
  ) {}
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    $('#datepicker').kendoDatePicker({
      format: 'MM/dd/yyyy HH:mm:ss', // Date and time format
      value: new Date(), // Initial date value
      dateInput: true, // Allow manual input of dates
    });
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'addDialog',
      1150,
      600,
      'add consultation'
    );
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'deleteDialog',
      600,
      300,
      'delete consultation'
    );
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'view-pat',
      800,
      500,
      'Voir fiche patient'
    );
    this.comb = $('#list-rdv')
      .kendoMultiColumnComboBox({
        dataTextField: 'titre',
        dataValueField: 'titre',
        height: 400,
        columns: [
          { field: 'titre', title: 'title', width: 200 },
          { field: 'dateRendezVous', title: 'Appointment date', width: 200 },
          { field: 'firstNameUser', title: 'Patient name', width: 200 },
          { field: 'lastNameUser', title: 'Patient first name', width: 200 },
        ],
        select: this.selectedRdv.bind(this), //function(e:any) {
        // var selectedItem = this.dataItem(e.item.index());
        // this.selectedPatientId=selectedItem.id;
        // console.log("secletd itemmmmm",selectedItem.id);
        // },
        filter: 'contains',
        filterFields: ['firstName', 'lastName', 'lastName', 'email'],
      })
      .data('kendoMultiColumnComboBox');

    this.DropDownMethodService.initializeDropDownComp(
      'dropDownEval',
      this.dropDownSearchLabel,
      'text',
      'value'
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'dropDownEval',
      'kendoDropDownList',
      300,
      0
    );
    var dataSoureval = [
      { text: 'positive', value: 'positive' },
      { text: 'negative', value: 'negative' },
      { text: 'neutral', value: 'neutral' },
    ];
    var droDowevalme = this.sharedMethodService.callKendoComponent(
      'dropDownEval',
      'kendoDropDownList'
    );
    droDowevalme.setDataSource(dataSoureval);
  }
  selectedRdv(e: any) {
    console.log('secletd itemmmmm', e);
    this.selectedRdvId = e.dataItem.id;
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
    this.getListConsultations();
    this.getListRdv();

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
        this.kendoDialogMethodService.closeKendoDialog(
          'view-pat',
          'kendoDialog'
        );
      }
    });
  }
  getListRdv() {
    var droDowRdv = this.sharedMethodService.callKendoComponent(
      'list-rdv',
      'kendoMultiColumnComboBox'
    );
    this.rdvService.GetListRdvDispo().subscribe({
      next: (successResponse) => {
        this.listRdvDispo = successResponse;
        console.log('list rdv', successResponse);
        this.comb.setDataSource(this.listRdvDispo);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  getListConsultations() {
    this.loadingGridRdv = true;
    this.consltService.GetListConsultation().subscribe({
      next: (successResponse) => {
        this.loadingGridRdv = false;
        this.listCons = successResponse;
        console.log('list consultation', successResponse);
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        this.loadingGridRdv = false;
        console.log(errorResponse);
      },
    });
  }
  InitializeGrid() {
    $('#gridCons')
      .kendoGrid({
        dataSource: {
          data: this.listCons,
          schema: {
            model: {
              uid: 'id',
              fields: {
                id: { type: 'string' },
                titre: { type: 'string' },
                dateConsultation: { type: 'Date' },
                description: { type: 'string' },
                evalMental: { type: 'string' },
                anctecMedical: { type: 'string' },
                rdvId: { type: 'string' },
                etatCons: { type: 'string' },
                fraisCons: { type: 'string' },
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
            template: this.addCons.nativeElement.innerHTML,
          },
        ],
        sortable: true,
        navigatable: true,
        resizable: true,
        reorderable: true,
        columnMenu: true,
      })
      .data('kendoGrid');
    $('#gridCons').on('click', '.k-grid-add', () => {
      this.isModeAdd = true;
      $('#addDialog').data('kendoDialog').title('Add Consultation');
      this.openDialogAdd();
      console.log('opened');
    });
    //handle remove event
    $('#gridCons').on('click', '.k-grid-remove', (e: any) => {
      this.sharedGridService.selectAutomaticallyRowInGrid(e);
      this.kendoDialogSharedService.openCenteredDialog('deleteDialog');
    });
    // handle edit event
    $('#gridCons').on('click', '.k-grid-edit', (e: any) => {
      this.isModeAdd = false;
      this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
      $('#addDialog').data('kendoDialog').title('Edit Consultation');
      this.openDialogAdd();
    });
    $('#gridCons').on('click', '.k-grid-visualize', (e: any) => {
      this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
      this.kendoDialogMethodService.openCenteredDialog('view-pat');
      this.getFicheByRdv();
    });
  }
  getFicheByRdv() {
    var grid = this.sharedMethodService.callKendoComponent(
      'gridCons',
      'kendoGrid'
    );
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
    console.log('patientttt', dataItem);
    this.rdvService.GetPatientByRdv(dataItem.rdvId).subscribe({
      next: (successResponse) => {
        this.patientToDisplay = successResponse;
        console.log('patientttt', this.patientToDisplay);
      },
      error: (errorResponse) => {
        this.loadingGridRdv = false;
        console.log(errorResponse);
      },
    });
  }
  prepareColumnGrid(): any[] {
    return [
      { field: 'titre', title: 'Title', width: '100px' },
      {
        field: 'dateConsultation',
        title: 'Consultation Date',
        format: '{0:dd/MM/yyyy HH:mm:ss}',
        width: '100px',
      },
      { field: 'description', title: 'Description', width: '400px' },
      { field: 'evalMental ', title: 'Mental evaluation ', width: '100px' },
      { field: 'anctecMedical', title: 'Medical history', width: '400px' },
      { field: 'etatCons', title: 'Consultation Status', width: '100px' },
      { field: 'fraisCons', title: 'Consultation Fees', width: '100px' },
      {
        title: 'Actions',
        template: this.myDivElement.nativeElement.innerHTML,
        width: '150px',
      },
    ];
  }

  cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
  openDialogAdd() {
    if (this.isModeAdd == false) {
      var grid = this.sharedMethodService.callKendoComponent(
        'gridCons',
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
    var listRdv = this.sharedMethodService.callKendoComponent(
      'list-rdv',
      'kendoMultiColumnComboBox'
    );
    var dropDownEval = this.sharedMethodService.callKendoComponent(
      'dropDownEval',
      'kendoDropDownList'
    );
    console.log('itemmmm', this.isModeAdd);
    this.titreInput = this.isModeAdd == true ? '' : dataItem.titre;
    this.DesconsInput = this.isModeAdd == true ? '' : dataItem.description;
    // this.evalInput = this.isModeAdd == true ? '' : dataItem.evalMental;
    this.anticInput = this.isModeAdd == true ? '' : dataItem.anctecMedical;
    this.isModeAdd
      ? $('#datepicker').data('kendoDatePicker').value('')
      : $('#datepicker')
          .data('kendoDatePicker')
          .value(dataItem.dateConsultation);
    this.idVirtualCons = this.isModeAdd == true ? '' : dataItem.id;
    listRdv.value(this.isModeAdd == true ? '' : dataItem.titre);
    dropDownEval.value(this.isModeAdd == true ? '' : dataItem.evalMental);
  }
  showErrValdTitreInput() {
    this.ctrlValdtitre = true;
    setTimeout(() => {
      this.ctrlValdtitre = false;
    }, 3000);
  }
  showErrValdDesc() {
    this.ctrlValdateDescCons = true;
    setTimeout(() => {
      this.ctrlValdateDescCons = false;
    }, 3000);
  }
  showErrValdAntcMedic() {
    this.ctrvalevalAnctMedic = true;
    setTimeout(() => {
      this.ctrvalevalAnctMedic = false;
    }, 3000);
  }
  showErrValDateCons() {
    this.ctrlValdateCons = true;
    setTimeout(() => {
      this.ctrlValdateCons = false;
    }, 3000);
  }
  showErrValEvalCons() {
    this.ctrvalevalcons = true;
    setTimeout(() => {
      this.ctrvalevalcons = false;
    }, 3000);
  }
  showErrValRdv() {
    this.ctrlValdRdv = true;
    setTimeout(() => {
      this.ctrlValdRdv = false;
    }, 3000);
  }
  controlValidationCompDialog(): any {
    var validItems = true;
    if (this.DesconsInput == '') {
      validItems = false;
      this.showErrValdDesc();
    }
    if (this.titreInput == '') {
      validItems = false;
      this.showErrValdTitreInput();
    }
    if (this.anticInput == '') {
      validItems = false;
      this.showErrValdAntcMedic();
    }
    if ($(`#datepicker`).data('kendoDatePicker').value() == null) {
      validItems = false;
      this.showErrValDateCons();
    }
    if (
      this.DropDownMethodService.selectedValueDropDownList(
        'dropDownEval',
        'kendoDropDownList'
      ) == ''
    ) {
      validItems = false;
      this.showErrValEvalCons();
    }
    if (
      this.DropDownMethodService.selectedValueDropDownList(
        'list-rdv',
        'kendoMultiColumnComboBox'
      ) == ''
    ) {
      validItems = false;
      this.showErrValRdv();
    }
    return validItems;
  }
  saveRecord() {
    if (this.controlValidationCompDialog()) {
      if (this.isModeAdd == true) {
        this.consToAdd = {
          titre: this.titreInput,
          dateConsultation: $(`#datepicker`).data('kendoDatePicker').value(),
          description: this.DesconsInput,
          evalMental: this.DropDownMethodService.selectedValueDropDownList(
            'dropDownEval',
            'kendoDropDownList'
          ),
          anctecMedical: this.anticInput,
          rdvId: this.selectedRdvId,
          isRemoved: 0,
          etatCons: 'nopay',
          fraisCons: 70,
        };
        this.consltService.AddCons(this.consToAdd).subscribe({
          next: (successResponse) => {
            console.log('added cons ', successResponse);
            this.kendoDialogSharedService.cancelDialog('addDialog');
            this.sharedMethodService.showSnackbar(
              'Consultation added successfully',
              'Success',
              'succ-snackbar'
            );
            this.getListConsultations();
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
        this.consToUpdate = {
          Id: this.idVirtualCons,
          titre: this.titreInput,
          dateConsultation: $(`#datepicker`).data('kendoDatePicker').value(),
          description: this.DesconsInput,
          evalMental: this.DropDownMethodService.selectedValueDropDownList(
            'dropDownEval',
            'kendoDropDownList'
          ),
          anctecMedical: this.anticInput,
        };
        this.consltService.UpdateCons(this.consToUpdate).subscribe({
          next: (successResponse) => {
            console.log('update cons ', successResponse);
            this.kendoDialogSharedService.cancelDialog('addDialog');
            this.sharedMethodService.showSnackbar(
              'Consultation modified successfully',
              'Success',
              'succ-snackbar'
            );
            this.getListConsultations();
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
      }
    }
  }
  removeRecord() {
    var dataItem = this.sharedGridService.selectedRowGrid(
      'gridCons',
      'kendoGrid'
    );
    this.consltService.RemoveRdv(dataItem.id).subscribe({
      next: (successResponse) => {
        console.log('isRemoved', successResponse);
        this.kendoDialogSharedService.cancelDialog('deleteDialog');
        this.sharedMethodService.showSnackbar(
          'Consultation deleted successfully',
          'Success',
          'succ-snackbar'
        );
        this.getListConsultations();
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
}
