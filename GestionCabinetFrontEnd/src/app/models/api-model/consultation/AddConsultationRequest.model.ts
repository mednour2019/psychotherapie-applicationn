export interface AddConsultationRequest{
  titre:string,
  dateConsultation:Date,
  description:string,
  evalMental:string,
  anctecMedical:string,
  fraisCons:number,
  etatCons:string,
  isRemoved:number,
  rdvId :string
}
