import { responsePieChart } from "./respnse-pie-chart.model";

export interface responseReportColChart{
  name:string,
  data:responsePieChart,
  color:string,
  labels:labelChart
}
export interface  labelChart{
  visible :string,
  background:string,
  format:string,

}
