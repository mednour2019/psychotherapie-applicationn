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
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { AddPatientRequest } from 'src/app/models/api-model/patient/AddPatientRequest.model';
import { UpdatedPatientRequest } from 'src/app/models/api-model/patient/UpdatedPatienRequest.model';
import { patientResponse } from 'src/app/models/api-model/patient/patient-response.model';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';

declare const $: any;
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit, AfterViewInit, OnDestroy{
  listPatients!: patientResponse[];
  routerSubscription: any;
  isModeAdd = true;
  dropDownSearchLabel = 'please select fields!';
  patientToAdd:AddPatientRequest={
    FirstName: '',
    LastName: '',
    Username: '',
    Email: '',
    Password: '',
    PhoneNumber: '',
    birthday: new Date(),
    address: '',
    chronicDiseases: 1,
    city: '',
    job: '',
    marriedSituation: '',
    sexe: '',
    isRemoved: 0,
  };
  patientToUpdate:UpdatedPatientRequest={
    Id:'',
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    birthday: new Date(),
    address: '',
    chronicDiseases: 1,
    city: '',
    job: '',
    marriedSituation: '',
    sexe: '',
    isRemoved: 0,
  };
  // control validation **********
  userNameInput: string = '';
  ctrlValduserName=false;
  ctrlValduserNameExistant=false;
  msgErrorValduserName='Please enter a username!';
  msgErrorValduserNameExistant='username already exists!';
  firstNameInput: string = '';
  ctrlValdfirstName=false;
  msgErrorValdfirstName='Please enter patient first name!';
  lastNameInput: string = '';
  ctrlValdlastName=false;
  msgErrorValdlastName='Please enter patient last name!';
  emailInput: string = '';
  ctrlValdEmail=false;
  msgErrorValdEmail='Please Enter mail!';
  passwordInput: string = '';
  ctrlValdPassword=false;
  ctrlValdPasswordCaracVal=false;
  msgErrorValdpassword ='Please enter password!';
  msgErrorValdpasswordcarac ='Please enter valid password !';

  //birthDay!: Date;
  ctrlValdBirthDay=false;
  msgErrorValdBirthDay ='Please enter birth day!';
  selectedValueRadioBtnSexe: string = '';
  ctrlValdSexe=false;
  msgErrorValdSexe='please check Sex!';
  phoneInput: string = '';
  ctrlValdPhone=false;
  msgErrorValdphone='Please Enter phone!';
  addressInput: string = '';
  ctrlValdAddress=false;
  msgErrorValAddress='Please enter patient address!';
  ctrlValdCity=false;
  msgErrorValdCity='Please enter Gouvernorate!';
  jobInput: string = '';
  ctrlValdjob=false;
  msgErrorValdjob='Please enter job!';
  ctrlValdMarriedSituation=false;
  msgErrorValdMarriedSituation='Please choose a marital status!';
  selectedValueRadioBtnChroniDis: string = '';
  ctrlValdChronic=false;
  msgErrorValdChronic='Please choose a disease!';

  birthday!: Date;
    // control validation **********
idVirtualPatient:string='';
loadingGridPatient=false;
lblloadingGrid='Please wait while the data is loading!';

  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('addPatient', { static: false }) addPatient!: ElementRef;
  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private sharedService: SharedService,
    private sharedMethodService:SharedMethodsService,
    private kendoDialogSharedService: KendoDialogSharedMethodsService,
    private sharedGridService:GridSharedMethodsService,
    private kendoChartService: KendoChartService,
    private buttonStateService:SharedService,
   private patientService:PatientService,
   private kendoDialogMethodService:KendoDialogSharedMethodsService,
   private DropDownMethodService:DropDownSharedMethodsService,
   private kendoGridMethodService:GridSharedMethodsService

  ) {
  }
  ngOnDestroy(): void {
  }
  loadCity(): any[] {
    var dataSourTyChart = [
      { text: 'sfax', value: 'sfax'},
      { text: 'tunisie', value: 'tunisie'},
      { text: 'sousse', value: 'sousse'},

    ];
    return dataSourTyChart;
  }
  loadMarriedSit(): any[] {
    var dataSourTyChart = [
      { text: 'single', value: 'single'},
      { text: 'maried', value: 'maried'},
      { text: 'divorced', value: 'divorced'},

    ];
    return dataSourTyChart;
  }
  ngAfterViewInit(): void {
    this.DropDownMethodService.initializeDropDownComp('dropDownCity',this.dropDownSearchLabel,'text','value');
    this.sharedMethodService.setWidthHeightKendoCom(
      'dropDownCity',
      'kendoDropDownList',
      300,
      0
    );
    this.loadDropDownCity();
    this.DropDownMethodService.initializeDropDownComp('dropDownMarriedSituation',this.dropDownSearchLabel,'text','value');
    this.sharedMethodService.setWidthHeightKendoCom(
      'dropDownMarriedSituation',
      'kendoDropDownList',
      300,
      0
    );
    this.loadDropDownMArriedSit();
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'addDialog',
      1150,
      600,
      'Add Formula(s)'
    );
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'deleteDialog',
      600,
      300,
      'supprimer patient'
    );
  }
  loadDropDownCity(){
    var droDowCity = this.sharedMethodService.callKendoComponent(
      'dropDownCity',
      'kendoDropDownList'
    );
    droDowCity.setDataSource(this.loadCity());
    $("#datepicker").kendoDatePicker({
      format: "MM/dd/yyyy", // Date format
      value: new Date(), // Initial date value
      dateInput: true // Allow manual input of dates
    })

  }
  loadDropDownMArriedSit(){
    var droDowMArrSit = this.sharedMethodService.callKendoComponent(
      'dropDownMarriedSituation',
      'kendoDropDownList'
    );
    droDowMArrSit.setDataSource(this.loadMarriedSit());
    this.sharedMethodService.setWidthHeightKendoCom(
      'datepicker',
      'kendoDatePicker',
      350,
      0
    );
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
    this.getListPatients();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this.kendoDialogMethodService.closeKendoDialog('addDialog','kendoDialog');
        this.kendoDialogMethodService.closeKendoDialog('deleteDialog','kendoDialog');

      }
    });
  }
  prepareColumnGrid(): any[] {
    return [
      { field: 'firstName', title: 'FirstName' ,width: "100px"},
      { field: 'lastName', title: 'LastName',width: "100px" },
      { field: 'userName', title: 'UserName',width: "100px" },
      { field: 'email', title: 'Email', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'birthday', title: 'birthday', format: '{0:dd/MM/yyyy}',width: "100px"},
      { field: 'phoneNumber', title: 'PhoneNumber',width: "100px" },
      { field: 'address', title: 'address',width: "100px" },
      { field: 'city', title: 'city',width: "100px" },
      { field: 'job', title: 'job',width: "100px" },
      { field: 'marriedSituation', title: 'marriedSituation',width: "100px" },
      { field: 'sexe', title: 'sexe',width: "100px" },
      { field: 'chronicDiseases', title: 'chronicDiseases',width: "100px" },

      {
        title: 'Actions',
        template: this.myDivElement.nativeElement.innerHTML,
        width: "150px"
      },
    ];
  }
  InitializeGrid() {
    $('#gridPatients')
       .kendoGrid({
         dataSource: {
           data: this.listPatients,
           schema: {
             model: {
               uid: 'id',
               fields: {
                 id: { type: 'string' },
                 firstName: { type: 'string' },
                 lastName: { type: 'string' },
                 userName: { type: 'string' },
                 email : { type: 'string' },
                 phoneNumber  : { type: 'string' },
                 birthday:{ type: 'Date' },
                 address:{ type: 'string' },
                 city: { type: 'string' },
                 job: { type: 'string' },
                 marriedSituation: { type: 'string' },
                 sexe: { type: 'string' },
                 chronicDiseases: { type: 'string' },

               },
             },
           },
           group: [
             { field: "sexe" }
           ]
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
          template:this.addPatient.nativeElement.innerHTML
        },
         ],
         sortable: true,
         navigatable: true,
          resizable: true,
         reorderable: true,
         columnMenu: true,
       })
       .data('kendoGrid');
       $('#gridPatients').on('click', '.k-grid-add', () => {
        this.isModeAdd = true;
        $("#addDialog").data("kendoDialog").title("Add patient");
        this.openDialogAdd();
        console.log("opened");
      });
        //handle remove event
    $('#gridPatients').on('click', '.k-grid-remove', (e:any) => {
       this.sharedGridService.selectAutomaticallyRowInGrid(e);
       this.kendoDialogSharedService.openCenteredDialog('deleteDialog');

     });
       // handle edit event
       $('#gridPatients').on('click', '.k-grid-edit', (e: any) => {
        this.isModeAdd = false;
     this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
     $("#addDialog").data("kendoDialog").title("Edit patient");
      this.openDialogAdd();

       });

   }
   openDialogAdd() {
    if (this.isModeAdd ==false) {
      var grid = this.sharedMethodService.callKendoComponent('gridPatients', 'kendoGrid');
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
    var dropDownCity = this.sharedMethodService.callKendoComponent(
      'dropDownCity',
      'kendoDropDownList'
    );
    var dropDownMarried = this.sharedMethodService.callKendoComponent(
      'dropDownMarriedSituation',
      'kendoDropDownList'
    );
  this.userNameInput=this.isModeAdd==true ?'' : dataItem.userName;
  this.firstNameInput=this.isModeAdd==true ?'' : dataItem.firstName;
  this.lastNameInput=this.isModeAdd==true ?'' : dataItem.lastName;
  this.addressInput=this.isModeAdd==true ?'' : dataItem.address;
 this.isModeAdd? $("#datepicker").data("kendoDatePicker").value(""): $("#datepicker").data("kendoDatePicker").value(dataItem.birthday);
  this.selectedValueRadioBtnChroniDis=this.isModeAdd==true ?"":(dataItem.chronicDiseases=="yes"?"1":"2");
  dropDownCity.value(this.isModeAdd==true ? '' : dataItem.city);
  this.emailInput=this.isModeAdd==true ?'' : dataItem.email;
  this.jobInput=this.isModeAdd==true ?'' : dataItem.job;
  dropDownMarried.value(this.isModeAdd==true ? '' : dataItem.marriedSituation);
  this.phoneInput=this.isModeAdd==true ?'' : dataItem.phoneNumber;
  this.selectedValueRadioBtnSexe=this.isModeAdd==true ?"":(dataItem.sexe=="male"?"1":"2");
  this.idVirtualPatient=this.isModeAdd==true ?'' : dataItem.id;
  }
  getListPatients() {
    this.loadingGridPatient= true;
    this.patientService.GetListPatients().subscribe({
      next: (successResponse) => {
        this.loadingGridPatient = false;
        this.listPatients = successResponse;
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        this.loadingGridPatient = false;
        console.log(errorResponse);
      },
    });
  }
  onRadioChange(event: any) {
    this.selectedValueRadioBtnSexe = event.value;
  }
  onRadioChangeChrinicDeas(event: any) {
    this.selectedValueRadioBtnChroniDis = event.value;
  }
  showErrValdUserNameInput() {
    this.ctrlValduserName= true;
    setTimeout(() => {
      this.ctrlValduserName = false;
    }, 3000);
  }
  showErrValdFirstNameInput() {
    this.ctrlValdfirstName= true;
    setTimeout(() => {
      this.ctrlValdfirstName = false;
    }, 3000);
  }
  showErrValdLastNameInput() {
    this.ctrlValdlastName= true;
    setTimeout(() => {
      this.ctrlValdlastName = false;
    }, 3000);
  }
  showErrValdEmailInput() {
    this.ctrlValdEmail= true;
    setTimeout(() => {
      this.ctrlValdEmail = false;
    }, 3000);
  }
  showErrValdPasswordInput() {
    this.ctrlValdPassword= true;
    setTimeout(() => {
      this.ctrlValdPassword = false;
    }, 3000);
  }
  showErrValdBirthDayInput() {
    this.ctrlValdBirthDay= true;
    setTimeout(() => {
      this.ctrlValdBirthDay = false;
    }, 3000);
  }
  showErrValdsexeInput() {
    this.ctrlValdSexe= true;
    setTimeout(() => {
      this.ctrlValdSexe = false;
    }, 3000);
  }
  showErrValdPhoneInput() {
    this.ctrlValdPhone= true;
    setTimeout(() => {
      this.ctrlValdPhone = false;
    }, 3000);
  }
  showErrValdAddressInput() {
    this.ctrlValdAddress= true;
    setTimeout(() => {
      this.ctrlValdAddress = false;
    }, 3000);
  }
  showErrValdCityInput() {
    this.ctrlValdCity= true;
    setTimeout(() => {
      this.ctrlValdCity = false;
    }, 3000);
  }
  showErrValdJobInput() {
    this.ctrlValdjob= true;
    setTimeout(() => {
      this.ctrlValdjob = false;
    }, 3000);
  }
  showErrValdMarriedInput() {
    this.ctrlValdMarriedSituation= true;
    setTimeout(() => {
      this.ctrlValdMarriedSituation = false;
    }, 3000);
  }
  showErrValdChronicInput() {
    this.ctrlValdChronic= true;
    setTimeout(() => {
      this.ctrlValdChronic = false;
    }, 3000);
  }
  showErrValdUserexistant() {
    this.ctrlValduserNameExistant= true;
    setTimeout(() => {
      this.ctrlValduserNameExistant = false;
    }, 3000);
  }
  showErrValdPasswordvalid() {
    this.ctrlValdPasswordCaracVal= true;
    setTimeout(() => {
      this.ctrlValdPasswordCaracVal = false;
    }, 3000);
  }
  controlValidationCompDialog():any{
    var validItems=true;
    var gridPatients = this.sharedMethodService.callKendoComponent('gridPatients', 'kendoGrid');
    if(this.userNameInput== ''){
      validItems=false;
      this.showErrValdUserNameInput();
    }
    if(this.firstNameInput== ''){
      validItems=false;
      this.showErrValdFirstNameInput();
    }
    if(this.lastNameInput== ''){
      validItems=false;
      this.showErrValdLastNameInput();
    }
    if(this.emailInput== ''){
      validItems=false;
      this.showErrValdEmailInput();
    }

    if(this.convertDate(`datepicker`)== null){
      validItems=false;
      this.showErrValdBirthDayInput();
    }
    if(this.selectedValueRadioBtnSexe== ''){
      validItems=false;
      this.showErrValdsexeInput();
    }
    if(this.phoneInput== ''){
      validItems=false;
      this.showErrValdPhoneInput();
    }
    if(this.addressInput== ''){
      validItems=false;
      this.showErrValdAddressInput();
    }
    if(this.DropDownMethodService.selectedValueDropDownList(
      'dropDownCity',
      'kendoDropDownList'
    )==''){
      validItems=false;
      this.showErrValdCityInput();
    }
    if(this.jobInput== ''){
      validItems=false;
      this.showErrValdJobInput();
    }
    if(this.DropDownMethodService.selectedValueDropDownList(
      'dropDownMarriedSituation',
      'kendoDropDownList'
    )==''){
      validItems=false;
      this.showErrValdMarriedInput();
    }
    if(this.selectedValueRadioBtnChroniDis== ''){
      validItems=false;
      this.showErrValdChronicInput();
    }
    if(this.isModeAdd==true){
      if(this.checkExistanceGrid(gridPatients,this.userNameInput)){
        validItems=false;
        this.showErrValdUserexistant();
      }
      if(!this.validatePassword(this.passwordInput)){
        validItems=false;
        this.showErrValdPasswordvalid();
      }
      if(this.passwordInput== ''){
        validItems=false;
        this.showErrValdPasswordInput();
      }

    }

    return validItems
  }
   validatePassword(password: string): boolean {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const numberRegex = /[0-9]/;

    return (
      lowercaseRegex.test(password) &&
      uppercaseRegex.test(password) &&
      specialCharRegex.test(password) &&
      numberRegex.test(password)
    );
  }
  checkExistanceGrid(grid:any,userName:any):boolean{
    var isExist=false;
    grid.dataSource._data.map(( item:any) => {
     if(item.userName===userName){

      isExist=true;
      return;
     }
    });
    return isExist;
  }
  convertDate(datepickerId:any) :any{
    var datepickerValue = $(`#${datepickerId}`).data("kendoDatePicker").value();
   return datepickerValue;
  }
  saveRecord() {
    if(this.controlValidationCompDialog())
      {
        if(this.isModeAdd==true)
          {

        this.patientToAdd={
          Username: this.userNameInput,
          FirstName:this.firstNameInput,
          LastName:this.lastNameInput,
          Email:this.emailInput,
          Password:this.passwordInput,
         birthday:this.convertDate(`datepicker`),
          sexe:this.selectedValueRadioBtnSexe=='1'?'male':'female',
          PhoneNumber:this.phoneInput,
          address:this.addressInput,
          city:this.DropDownMethodService.selectedValueDropDownList(
            'dropDownCity',
            'kendoDropDownList'
          ),
          job:this.jobInput,
          marriedSituation:  this.DropDownMethodService.selectedValueDropDownList(
            'dropDownMarriedSituation',
            'kendoDropDownList'
          ),
         chronicDiseases:this.selectedValueRadioBtnChroniDis=='1'?1:0,
          isRemoved:0

        }
        this.patientService.AddPatient(this.patientToAdd).subscribe({
          next: (successResponse) => {
            console.log('added patient ', successResponse);
          this.kendoDialogSharedService.cancelDialog('addDialog');
            this.sharedMethodService.showSnackbar(
              'Patient added successfully',
              'Success',
              'succ-snackbar'
            );
            this.getListPatients();
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
        else {
          this.patientToUpdate={
            Id:this.idVirtualPatient,
            FirstName:this.firstNameInput,
            LastName:this.lastNameInput,
            Email:this.emailInput,
           birthday:this.convertDate(`datepicker`),
            sexe:this.selectedValueRadioBtnSexe=='1'?'male':'female',
            PhoneNumber:this.phoneInput,
            address:this.addressInput,
            city:this.DropDownMethodService.selectedValueDropDownList(
              'dropDownCity',
              'kendoDropDownList'
            ),
            job:this.jobInput,
            marriedSituation:  this.DropDownMethodService.selectedValueDropDownList(
              'dropDownMarriedSituation',
              'kendoDropDownList'
            ),
           chronicDiseases:this.selectedValueRadioBtnChroniDis=='1'?1:0,
            isRemoved:0

          }
          console.log('ptient',this.patientToUpdate);
          this.patientService.updatePatient(this.patientToUpdate).subscribe({
            next: (successResponse) => {
              console.log('update patient ', successResponse);
            this.kendoDialogSharedService.cancelDialog('addDialog');
              this.sharedMethodService.showSnackbar(
                'Patient edited successfully',
                'Success',
                'succ-snackbar'
              );
              this.getListPatients();
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
  cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
  removeRecord() {
    var dataItem= this.sharedGridService.selectedRowGrid('gridPatients', 'kendoGrid');
     this.patientService.RemovePatient(dataItem.id).subscribe({
       next: (successResponse) => {
         console.log('isRemoved', successResponse);
         this.kendoDialogSharedService.cancelDialog("deleteDialog");
         this.sharedMethodService.showSnackbar(
           'patient deleted successfully',
           'Success',
           'succ-snackbar'
         );
         this.getListPatients();
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
