export interface AddOrdenRequest{
  dateCreation:Date,
  emmetteur:string,
  description:string,
  dateValidité :Date,
  suiviRecomm :string,
  isRemoved:number,
  userId :string
}
