import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MaxValidator } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { responsePieChart } from 'src/app/models/api-model/reportChart/respnse-pie-chart.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ConsultService } from 'src/app/services/consultation/consult.service';
import { DataSharingService } from 'src/app/services/dataService.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SharedApiMethodsService } from 'src/app/services/shared-api-methods/shared-api-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';
declare const kendo: any; // Declare kendo to avoid TypeScript errors
declare const $: any;
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('myDivElement2', { static: false }) myDivElement2!: ElementRef;
  user!: ApplicationUser;
  nbPatient:number=0;
  Profit:number=0;

  listPatSexPieChart!: responsePieChart[];
  constructor(
    private dataSharingService: DataSharingService,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private snackbar: MatSnackBar,
    private sharedMethodService:SharedMethodsService,
    private sharedMethodApiMethods:SharedApiMethodsService,
    private kendoChartService: KendoChartService,
    private patientService:PatientService,
    private consltService: ConsultService

  ) {}
  ngAfterViewInit(): void {
    this.getStatSexPat();
    this.getEtatRdvBarChart();

  }
  getEtatRdvBarChart(){
    $("#bar-chart-etat-rdv").kendoChart({
      title: {
          text: "appointement number per status",
          color:"black",
          font: "20px sans-serif"
      },
      legend: {
        visible: true,
        color:"black",
        font: "15px sans-serif"/*'Sample Bar Chart'*/,
      },
      dataSource: {
          transport: {
              read: {
                  url: "https://localhost:7243/RendreVous/rdvcount",
                  dataType: "json",
              }
          }
      },
      series: [{
          type: "column",
          field: "count",
          categoryField: "status",
          color: "#6c757d"
      }],
      categoryAxis: {
          field: "status",
          labels: {
              rotation: 0,
              color:"black",
              font: "15px sans-serif"
          }
      },
      valueAxis: {
          title: {
              text: "status number appointement",
              color:"black",
          font: "15px sans-serif",
          }
      },
      tooltip: {
          visible: true,
          template: "#= category # : #= value #",
          //visible: true,
         // template: '#= series.name #: #= kendo.toString(value, "'+this.tooltipForRound3+'") #',
            color:"black",
            font: "15px sans-serif",
      },
      chartArea: {
        width: 800, // Set the width here
        height: 600, // Set the height here
      },
  });
  }
  getStatSexPat(){
    var newChartContainer: HTMLElement = this.myDivElement.nativeElement;
    this.patientService.GetSexPatPieChart().subscribe({
      next: (successResponse) => {
        this.listPatSexPieChart = successResponse;
        this.kendoChartService.createPieChart(
          this.listPatSexPieChart,
          newChartContainer,
          'patient number per Sexe',
          900,
          450,
          45
        );
        var chart = $(`#pie-chart-sexe`).data('kendoChart');
        chart.options.series.map((item: any) => {
          item.labels.format =null;/*"{0:p}"*/ /*"{0}%"*/;
          item.tooltip.template='#=category #: #= value #';
        });
        chart.redraw();
      },
      error: (errorResponse) => {
        this.sharedMethodService.showSnackbar('Error contact admin', 'Error!', '');
      },
    });
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
    this.getNumberPatient();
    this.getTotalProfit();

  }
  getNumberPatient(){
    this.patientService.GetNumbPatients().subscribe({
      next: (successResponse) => {
        this.nbPatient=successResponse
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  getPDF(a:any){
    kendo.drawing.drawDOM($(a)).then(function (group:any) {
      kendo.drawing.pdf.saveAs(group, "stat.pdf");
    });
  }

  getTotalProfit(){
    this.consltService.GetProfit().subscribe({
      next: (successResponse) => {
        this.Profit = successResponse;
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }

}
