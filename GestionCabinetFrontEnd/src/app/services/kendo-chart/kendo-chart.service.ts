import { AfterViewInit, Injectable, OnInit } from '@angular/core';
declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class KendoChartService  implements OnInit, AfterViewInit {
  formatRound3='{0:n3}';
  formatCurrency='{0:c}';
  formatPercent="{0:p}";
  tooltipForRound3="n3";
  tooltipForCurrency="c";
  tooltipForPercent="p";
  constructor() { }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {

  }

  createPieChart(ChartData: any[], newChartContainer: any, titleReport: any,width:any,height:any,degreeRotation:any) {
  /*newChartContainer*/ $(`#${newChartContainer.id}`).kendoChart({
      title: {
        text: titleReport /*'Sample Pie Chart'*/,
        visible:true,
        color:"black",
        font: "20px sans-serif"/*'Sample Bar Chart'*/,
      },

      legend: {
        // position: 'bottom',
        labels: {
          overflow: 'auto',
        },
      },
      series: [
        {
          type: 'pie',
          data: ChartData,
          labels: {
            visible: true,
            color:"black",
             font: "15px sans-serif",
             format: this.formatRound3

          },
          field: 'value',
          categoryField: 'category',
          highlight: {
            border: {
              opacity: 1,
              width: 2,
              color: "black"
            }
          }
        },
      ],
      tooltip: {
        visible: true,
       // template: '#= category #: #= value #',
        template: '#= category #: #= kendo.toString(value, "'+this.tooltipForRound3+'") #',

        color:"black",
        font: "15px sans-serif"
      },
      chartArea: {
        width: width, // Set the width here
        height: height, // Set the height here
      },
      categoryAxis: {
        labels: {
          rotation: degreeRotation, // Specify the rotation angle (in degrees)
        },
      },

    });
  }
  createColBarOrStackedChart(
    chartData: any[],
    newChartContainer: any,
    typeChart: any,
    isStackedChart: any,
    maxKpiValue: any,
    titleReport: any,
    degreeRotation:any,
    width:any,
    height:any,
    axis:any
  ) {
    $(`#${newChartContainer.id}`).kendoChart({
      title: {
        text: titleReport ,
        color:"black",
        font: "20px sans-serif"/*'Sample Bar Chart'*/,
      },
      legend: {
        visible: true,
        color:"black",
        font: "15px sans-serif"/*'Sample Bar Chart'*/,
      },
      seriesDefaults: {
        type:typeChart,
        stack: isStackedChart,
      },
    series: chartData,
      /*series: [ {
        labels: {
          visible: true,
          color:"black",
        font: "15px sans-serif",
        },
        data:chartData
      }],*/
      valueAxis: [{
        max:maxKpiValue,
        color:"black",
        font: "15px sans-serif",
        mirror: true,
        labels: {
          format:this.formatRound3,
          //type: "100%"
        }

      }],
      categoryAxis: {
        categories: chartData[0].data.map((item: any) => item.category), // Assuming all series have the same categories
        labels: {
          rotation: degreeRotation ,// Specify the rotation angle (in degrees)
          color:"black",
        font: "15px sans-serif"
        }
      },
      tooltip: {
        visible: true,
        template: '#= series.name #: #= kendo.toString(value, "'+this.tooltipForRound3+'") #',
          color:"black",
          font: "15px sans-serif",
      },
      chartArea: {
        width: width, // Set the width here
        height: height, // Set the height here
      },
      pannable: {
        lock:axis
    },
    zoomable: {
        mousewheel: {
            lock: axis
        },
        selection: {
            lock: axis
        }
    }


    });
  }
}
