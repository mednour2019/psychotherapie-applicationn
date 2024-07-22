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
import { patientResponse } from 'src/app/models/api-model/patient/patient-response.model';
import { RendezVousService } from 'src/app/services/Rdv/rendez-vous.service';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';

declare const $: any;

@Component({
  selector: 'app-rendezvous',
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css'],
})
export class RendezvousComponent implements OnInit, AfterViewInit, OnDestroy {
  loadingGridRdv = false;
  lblloadingGrid = 'Please wait while the data is loading!';
  listRdv!: RendezVousResponse[];
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('addRdv', { static: false }) addRdv!: ElementRef;
  isModeAdd = true;
  listPatients!: patientResponse[];
  routerSubscription: any;
  dropDownSearchLabel = 'please select fields...';
  comb: any;
  selectedPatientId: string = '';
  rdvToAdd: AddRendezVousRequest = {
    titre: '',
    dateRendezVous: new Date(),
    etatRendezVous: '',
    isRemoved: 0,
    UserId: '',
  };
  rdvToUpdate: UpdatedRendezVousRequest = {
    Id: '',
    titre: '',
    dateRendezVous: new Date(),
    etatRendezVous: '',
    modePat: '',
    //UserId: ''
  };
  idVirtualRdv: string = '';

  //***control validaton
  titreInput: string = '';
  ctrlValdtitre = false;
  msgErrorValdtitre = 'Please enter an appointment title!';
  ctrlValdateRdv = false;
  msgErrorValdateRdv = 'please enter appointement date';
  ctrlValdEtat = false;
  msgErrorValdEtat = 'Please select appointement statuss!';
  ctrlValdPatient = false;
  msgErrorValdPatient = 'please select patient!';

  ctrlValdDateExist = false;

  // ********
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
    private patientService: PatientService
  ) {}
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.DropDownMethodService.initializeDropDownComp(
      'dropDownetat',
      this.dropDownSearchLabel,
      'text',
      'value'
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'dropDownetat',
      'kendoDropDownList',
      300,
      0
    );
    var dataSourRdv = [
      { text: 'Pending', value: 'Pending' },
      { text: 'Rejection', value: 'Rejection' },
      { text: 'acceptation', value: 'acceptation' },
    ];
    var droDowetat = this.sharedMethodService.callKendoComponent(
      'dropDownetat',
      'kendoDropDownList'
    );
    droDowetat.setDataSource(dataSourRdv);
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'addDialog',
      1150,
      400,
      'ajouter rendez-vous'
    );
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'deleteDialog',
      600,
      300,
      'supprimer Rdv'
    );
    $('#datepicker').kendoDatePicker({
      format: 'MM/dd/yyyy HH:mm:ss', // Date and time format
      value: new Date(), // Initial date value
      dateInput: true, // Allow manual input of dates
    });
    this.comb = $('#list-patients')
      .kendoMultiColumnComboBox({
        dataTextField: 'firstName',
        dataValueField: 'firstName',
        height: 400,
        columns: [
          { field: 'firstName', title: 'First Name', width: 200 },
          { field: 'lastName', title: 'Last Name', width: 200 },
          { field: 'lastName', title: 'User Name', width: 200 },
          { field: 'email', title: 'Email', width: 200 },
        ],
        select: this.selectedPatient.bind(this), //function(e:any) {
        // var selectedItem = this.dataItem(e.item.index());
        // this.selectedPatientId=selectedItem.id;
        // console.log("secletd itemmmmm",selectedItem.id);
        // },
        filter: 'contains',
        filterFields: ['firstName', 'lastName', 'lastName', 'email'],
      })
      .data('kendoMultiColumnComboBox');
  }
  selectedPatient(e: any) {
    console.log('secletd itemmmmm', e);
    this.selectedPatientId = e.dataItem.id;
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
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
    this.getListRdv();
    this.getListPatients();
  }
  getListPatients() {
    var droDowpatients = this.sharedMethodService.callKendoComponent(
      'list-patients',
      'kendoMultiColumnComboBox'
    );
    this.patientService.GetListPatients().subscribe({
      next: (successResponse) => {
        this.listPatients = successResponse;
        // console.log('list patients',successResponse);
        this.comb.setDataSource(this.listPatients);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  getListRdv() {
    this.loadingGridRdv = true;
    this.rdvService.GetListRdv().subscribe({
      next: (successResponse) => {
        this.loadingGridRdv = false;
        this.listRdv = successResponse;
        console.log('list rdv', successResponse);
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        this.loadingGridRdv = false;
        console.log(errorResponse);
      },
    });
  }
  InitializeGrid() {
    $('#gridRdv')
      .kendoGrid({
        dataSource: {
          data: this.listRdv,
          schema: {
            model: {
              uid: 'id',
              fields: {
                id: { type: 'string' },
                titre: { type: 'string' },
                dateRendezVous: { type: 'Date' },
                etatRendezVous: { type: 'string' },
                userId: { type: 'string' },
                firstNameUser: { type: 'string' },
                lastNameUser: { type: 'string' },
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
            template: this.addRdv.nativeElement.innerHTML,
          },
        ],
        sortable: true,
        navigatable: true,
        resizable: true,
        reorderable: true,
        columnMenu: true,
      })
      .data('kendoGrid');
    $('#gridRdv').on('click', '.k-grid-add', () => {
      this.isModeAdd = true;
      $('#addDialog').data('kendoDialog').title('Add appointement');
      this.openDialogAdd();
      console.log('opened');
    });
    //handle remove event
    $('#gridRdv').on('click', '.k-grid-remove', (e: any) => {
      this.sharedGridService.selectAutomaticallyRowInGrid(e);
      this.kendoDialogSharedService.openCenteredDialog('deleteDialog');
    });
    // handle edit event
    $('#gridRdv').on('click', '.k-grid-edit', (e: any) => {
      this.isModeAdd = false;
      this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
      $('#addDialog').data('kendoDialog').title('Edit appointement');
      this.openDialogAdd();
    });
  }
  prepareColumnGrid(): any[] {
    return [
      { field: 'titre', title: 'Title', width: '200px' },
      {
        field: 'dateRendezVous',
        title: 'Appointement Date',
        format: '{0:dd/MM/yyyy HH:mm:ss}',
        width: '100px',
      },
      { field: 'etatRendezVous', title: 'appointement status', width: '100px' },
      { field: 'firstNameUser', title: 'patient name', width: '100px' },
      { field: 'lastNameUser', title: 'patient last name', width: '100px' },
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
  saveRecord() {
    if (this.controlValidationCompDialog()) {
      if (this.isModeAdd == true) {
        this.rdvToAdd = {
          titre: this.titreInput,
          dateRendezVous: $(`#datepicker`).data('kendoDatePicker').value(),
          etatRendezVous: this.DropDownMethodService.selectedValueDropDownList(
            'dropDownetat',
            'kendoDropDownList'
          ),
          UserId: this.selectedPatientId,
          isRemoved: 0,
        };
        this.rdvService.AddRdv(this.rdvToAdd).subscribe({
          next: (successResponse) => {
            console.log('added rdv ', successResponse);
            this.kendoDialogSharedService.cancelDialog('addDialog');
            this.sharedMethodService.showSnackbar(
              'appointement added succesfully',
              'Success',
              'succ-snackbar'
            );
            this.getListRdv();
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
        console.log('nourrrrrrrrrrrrrrr');
        this.rdvToUpdate = {
          Id: this.idVirtualRdv,
          titre: this.titreInput,
          etatRendezVous: this.DropDownMethodService.selectedValueDropDownList(
            'dropDownetat',
            'kendoDropDownList'
          ),
          dateRendezVous: $(`#datepicker`).data('kendoDatePicker').value(),
          modePat: '',
          //  UserId:this.selectedPatientId
        };
        this.rdvService.UpdateRdv(this.rdvToUpdate).subscribe({
          next: (successResponse) => {
            console.log('update rdv ', successResponse);
            this.kendoDialogSharedService.cancelDialog('addDialog');
            this.sharedMethodService.showSnackbar(
              'Appointement edited succesfully',
              'Success',
              'succ-snackbar'
            );
            this.getListRdv();
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

    //console.log("selected pattttIddd",this.selectedPatientId);
  }
  openDialogAdd() {
    if (this.isModeAdd == false) {
      var grid = this.sharedMethodService.callKendoComponent(
        'gridRdv',
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
    console.log('itemmmm', this.isModeAdd);
    var listPatients = this.sharedMethodService.callKendoComponent(
      'list-patients',
      'kendoMultiColumnComboBox'
    );
    var dropDownetat = this.sharedMethodService.callKendoComponent(
      'dropDownetat',
      'kendoDropDownList'
    );
    this.titreInput = this.isModeAdd == true ? '' : dataItem.titre;
    listPatients.value(this.isModeAdd == true ? '' : dataItem.firstNameUser);
    dropDownetat.value(this.isModeAdd == true ? '' : dataItem.etatRendezVous);
    this.isModeAdd
      ? $('#datepicker').data('kendoDatePicker').value('')
      : $('#datepicker').data('kendoDatePicker').value(dataItem.dateRendezVous);
    this.idVirtualRdv = this.isModeAdd == true ? '' : dataItem.id;
    this.isModeAdd == true
      ? listPatients.enable(true)
      : listPatients.enable(false);
  }
  checkExistanceGrid(grid: any, dateRdv: any): boolean {
    grid= this.sharedMethodService.callKendoComponent(grid,"kendoGrid")
    var isExist = false;
    console.log("my griddd",grid)
    grid.dataSource._data.map((item: any) => {
      if (item.dateRendezVous === dateRdv) {
        isExist = true;
        return;
      }
    });
    return isExist;
  }
  controlValidationCompDialog(): any {
    var validItems = true;
    if (this.titreInput == '') {
      validItems = false;
      this.showErrValdTitreInput();
    }
    if (
      this.DropDownMethodService.selectedValueDropDownList(
        'dropDownetat',
        'kendoDropDownList'
      ) == ''
    ) {
      validItems = false;
      this.showErrValdEtatInput();
    }
    if (
      this.DropDownMethodService.selectedValueDropDownList(
        'list-patients',
        'kendoMultiColumnComboBox'
      ) == ''
    ) {
      validItems = false;
      this.showErrValdPAtientInput();
    }
    if(this.isModeAdd==true){
      if(this.checkExistanceGrid("gridRdv",$('#datepicker').data('kendoDatePicker').value())){
        validItems = false;
        this.showErrVaDAteExist()
      }
    }

    return validItems;
  }
  showErrValdTitreInput() {
    this.ctrlValdtitre = true;
    setTimeout(() => {
      this.ctrlValdtitre = false;
    }, 3000);
  }
  showErrValdEtatInput() {
    this.ctrlValdEtat = true;
    setTimeout(() => {
      this.ctrlValdEtat = false;
    }, 3000);
  }
  showErrValdDAteInput() {
    this.ctrlValdateRdv = true;
    setTimeout(() => {
      this.ctrlValdateRdv = false;
    }, 3000);
  }
  showErrValdPAtientInput() {
    this.ctrlValdPatient = true;
    setTimeout(() => {
      this.ctrlValdPatient = false;
    }, 3000);
  }
  showErrVaDAteExist() {
    this. ctrlValdDateExist = true;
    setTimeout(() => {
      this.ctrlValdDateExist= false;
    }, 3000);
  }
  removeRecord() {
    var dataItem = this.sharedGridService.selectedRowGrid(
      'gridRdv',
      'kendoGrid'
    );
    this.rdvService.RemoveRdv(dataItem.id).subscribe({
      next: (successResponse) => {
        console.log('isRemoved', successResponse);
        this.kendoDialogSharedService.cancelDialog('deleteDialog');
        this.sharedMethodService.showSnackbar(
          'appointement deleted succefully',
          'Success',
          'succ-snackbar'
        );
        this.getListRdv();
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
