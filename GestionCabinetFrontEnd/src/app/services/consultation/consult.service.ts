import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRendezVousRequest } from 'src/app/models/api-model/Rdv/AddRendezVousRequest.model';
import { RendezVousResponse } from 'src/app/models/api-model/Rdv/RendezVousResponse.model';
import { UpdatedRendezVousRequest } from 'src/app/models/api-model/Rdv/UpdatedRendezVousRequest.model';
import { AddConsultationRequest } from 'src/app/models/api-model/consultation/AddConsultationRequest.model';
import { ConsultationResponse } from 'src/app/models/api-model/consultation/ConsultationResponse.model';
import { UpdatedConsultationRequest } from 'src/app/models/api-model/consultation/UpdatedConsultationRequest.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConsultService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) { }
  GetListConsultation():Observable<ConsultationResponse[]>{
    return this.httpClient.get<ConsultationResponse[]>(
      `${this.baseApiUrl}/Consultation/getListCons`
      );
  }
  AddCons(cons: AddConsultationRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Consultation/addConsultation',
      cons
    );
  }
  UpdateCons(cons: UpdatedConsultationRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Consultation/updateConsultation',
      cons
    );
  }
  RemoveRdv(consId:string):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/Consultation/RemoveCons/${consId}`,
      consId
    );
  }
  getConsNonPayerByPatient(patientId:string):Observable<ConsultationResponse[]>{
    return this.httpClient.post<ConsultationResponse[]>(
      `${this.baseApiUrl}/Consultation/getConsByPatId/${patientId}`,
      patientId
    );
  }
  getConsByFactId(fctrID:string):Observable<ConsultationResponse[]>{
    return this.httpClient.post<ConsultationResponse[]>(
      `${this.baseApiUrl}/Consultation/getConsByFactId/${fctrID}`,
      fctrID
    );
  }
  GetProfit():Observable<number>{
    return this.httpClient.get<number>(
      `${this.baseApiUrl}/Consultation/getProfit`
      );
  }
}
