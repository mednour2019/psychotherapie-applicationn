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
declare const kendo: any;
@Component({
  selector: 'app-prend-rdv',
  templateUrl: './prend-rdv.component.html',
  styleUrls: ['./prend-rdv.component.css'],
})
export class PrendRdvComponent implements OnInit, AfterViewInit, OnDestroy {
  loadingGridRdv = false;
  lblloadingGrid = 'SVP patienter lors chargement du données!';
  listRdv!: RendezVousResponse[];
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('addRdv', { static: false }) addRdv!: ElementRef;
  isModeAdd = true;
  routerSubscription: any;
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
    modePat:''
    //UserId: ''
  };
  user!: ApplicationUser;
  idVirtualRdv: string = '';
  //***control validaton
  titreInput: string = '';
  etatRdv: string = '';
  ctrlValdtitre = false;
  msgErrorValdtitre = 'Please enter an appointment title!';
  ctrlValdateRdv = false;
  msgErrorValdateRdv = 'Please enter an appointment date!';

  dropDownSearchLabel = 'please select field...';

  isExistRdv = false;
  ctrValIsExistDateRdv = false;
  ctrValDateVAlid = false;

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
    private ordService: OrdenanceService
  ) {}
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
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
    $("#datepicker").kendoDatePicker({
      format: "MM/dd/yyyy HH:mm:ss", // Date and time format
      value: new Date(), // Initial date value
      dateInput: true // Allow manual input of dates
  });
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
    this.user = this.sharedService.user;
    console.log('userr222222', this.user);
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
    this.getListRdvByPatId();
  }
  getListRdvByPatId() {
    this.loadingGridRdv = true;
    this.rdvService.GetRdvByPatId(this.user.id).subscribe({
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
  prepareColumnGrid(): any[] {
    return [
      { field: 'titre', title: 'Title', width: '200px' },
      { field: 'dateRendezVous', title: 'Appointement date', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'etatRendezVous', title: 'appointement status', width: '100px' },
      {
        title: 'Actions',
        template: this.myDivElement.nativeElement.innerHTML,
        width: '150px',
      },
    ];
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
    this.titreInput = this.isModeAdd == true ? '' : dataItem.titre;
    this.isModeAdd
      ? $('#datepicker').data('kendoDatePicker').value('')
      : $('#datepicker').data('kendoDatePicker').value(dataItem.dateRendezVous);
    this.idVirtualRdv = this.isModeAdd == true ? '' : dataItem.id;
    this.etatRdv = dataItem.etatRendezVous;
    var datepickerRdv = this.sharedMethodService.callKendoComponent(
      'datepicker',
      'kendoDatePicker'
    );
    this.isModeAdd==true ?datepickerRdv.enable(true):datepickerRdv.enable(false);

  }
  convertDate(datepickerId: any): any {
    var datepickerValue = $(`#${datepickerId}`).data('kendoDatePicker').value();
    return datepickerValue;
  }
  controlValidationCompDialog(): any {
    var validItems = true;
    if (this.titreInput == '') {
      validItems = false;
      this.showErrValdTitreInput();
    }

    if (this.convertDate(`datepicker`) == null) {
      validItems = false;
      this.showErrValdDAteInput();
    }
    if (this.compareIfDateInfToday() == false) {
      validItems = false;
      this.showErrDAteIndToday();
    }
    return validItems;
  }
  showErrDAteIndToday() {
    this.ctrValDateVAlid = true;
    setTimeout(() => {
      this.ctrValDateVAlid = false;
    }, 3000);
  }
  checkExistanceDateRdv() {
    if (this.controlValidationCompDialog()) {
      if(this.isModeAdd==true){
        var datePickerValue = $(`#datepicker`).data('kendoDatePicker').value();
        var year = datePickerValue.getFullYear();
        var month = (datePickerValue.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        var day = datePickerValue.getDate().toString().padStart(2, '0');
        var hours = datePickerValue.getHours().toString().padStart(2, '0');
        var minutes = datePickerValue.getMinutes().toString().padStart(2, '0');
        var seconds = datePickerValue.getSeconds().toString().padStart(2, '0');
        var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        this.rdvService.checkExistingRdvByPatId(formattedDate).subscribe({
          next: (successResponse) => {
            this.isExistRdv = successResponse;
            if (this.isExistRdv) {
              this.showErrValdExistDAte();
            } else {
              this.AddUpdateRdv();
            }
          },
          error: (errorResponse) => {
            console.log(errorResponse);
            this.sharedMethodService.showSnackbar(
              'Error contact Admin',
              'Error!',
              ''
            );
          },
        });
      }
      else{
        // to avoid check existance rdv
        this.AddUpdateRdv();
      }

    }
  }
  showErrValdTitreInput() {
    this.ctrlValdtitre = true;
    setTimeout(() => {
      this.ctrlValdtitre = false;
    }, 3000);
  }

  showErrValdDAteInput() {
    this.ctrlValdateRdv = true;
    setTimeout(() => {
      this.ctrlValdateRdv = false;
    }, 3000);
  }
  showErrValdExistDAte() {
    this.ctrValIsExistDateRdv = true;
    setTimeout(() => {
      this.ctrValIsExistDateRdv = false;
    }, 3000);
  }
  cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
  AddUpdateRdv() {
    if (this.isModeAdd == true) {
      this.rdvToAdd = {
        titre: this.titreInput,
        dateRendezVous: $(`#datepicker`).data("kendoDatePicker").value(),
        etatRendezVous: 'Pending',
        UserId: this.user.id,
        isRemoved: 0,
      };
      this.rdvService.AddRdv(this.rdvToAdd).subscribe({
        next: (successResponse) => {
          console.log('added rdv ', successResponse);
          this.kendoDialogSharedService.cancelDialog('addDialog');
          this.sharedMethodService.showSnackbar(
            'Appointement added succesfully',
            'Success',
            'succ-snackbar'
          );
          this.getListRdvByPatId();
        },
        error: (errorResponse) => {
          console.log(errorResponse);
          this.kendoDialogSharedService.cancelDialog('addDialog');
          this.sharedMethodService.showSnackbar(
            'Error conatct Admin',
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
        dateRendezVous: $(`#datepicker`).data('kendoDatePicker').value(),
        etatRendezVous: this.etatRdv,
        modePat:'patient'
      };
      this.rdvService.UpdateRdv(this.rdvToUpdate).subscribe({
        next: (successResponse) => {
          console.log('update rdv ', successResponse);
          this.kendoDialogSharedService.cancelDialog('addDialog');
          this.sharedMethodService.showSnackbar(
            'Appointement edited succefully',
            'Success',
            'succ-snackbar'
          );
          this.getListRdvByPatId();
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
  compareIfDateInfToday(): boolean {
    var valid = false;
    var selectedDate: Date = $('#datepicker').data('kendoDatePicker').value();
    if(selectedDate!=undefined){
        var currentDate: Date = new Date();
        currentDate.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() >= currentDate.getTime()) {
        valid = true;
      }
    }

    return valid;
  }
  saveRecord() {
    this.checkExistanceDateRdv();
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
          'Appointement removed succefully',
          'Success',
          'succ-snackbar'
        );
        this.getListRdvByPatId();
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
