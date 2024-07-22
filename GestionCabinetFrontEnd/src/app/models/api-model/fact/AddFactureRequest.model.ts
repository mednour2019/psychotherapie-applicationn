export interface AddFactureRequest{
  dateCreation:Date,
  description:string,
  adressCabinet:string,
  matrFiscCabinet:string,
  isRemoved:number,
  ConsultationIds:string[],
  etatCons:string
}
