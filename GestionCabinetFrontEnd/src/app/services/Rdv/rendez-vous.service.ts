import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRendezVousRequest } from 'src/app/models/api-model/Rdv/AddRendezVousRequest.model';
import { RendezVousResponse } from 'src/app/models/api-model/Rdv/RendezVousResponse.model';
import { UpdatedRendezVousRequest } from 'src/app/models/api-model/Rdv/UpdatedRendezVousRequest.model';
import { patientResponse } from 'src/app/models/api-model/patient/patient-response.model';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private baseApiUrl = environment.baseApiUrl;
  constructor(private httpClient: HttpClient) { }
  GetListRdv():Observable<RendezVousResponse[]>{
    return this.httpClient.get<RendezVousResponse[]>(
      `${this.baseApiUrl}/RendreVous/getListRendezVous`
      );
  }
  AddRdv(rdv: AddRendezVousRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/RendreVous/addRdv',
      rdv
    );
  }
  UpdateRdv(rdv: UpdatedRendezVousRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/RendreVous/Updatedv',
      rdv
    );
  }
  RemoveRdv(RendezVousId:string):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/RendreVous/RemoveRendezVous/${RendezVousId}`,
      RendezVousId
    );
  }
  GetListRdvDispo():Observable<RendezVousResponse[]>{
    return this.httpClient.get<RendezVousResponse[]>(
      `${this.baseApiUrl}/RendreVous/getListRendezVousDispo`
      );
  }
  GetPatientByRdv(RdvId:string):Observable<patientResponse>{
    return this.httpClient.post<patientResponse>(
      `${this.baseApiUrl}/RendreVous/getPatByRDb/${RdvId}`,
      RdvId
    );
  }
  GetRdvByPatId(patId:string):Observable<RendezVousResponse[]>{
    return this.httpClient.post<RendezVousResponse[]>(
      `${this.baseApiUrl}/RendreVous/getRdvByPatId/${patId}`,
      patId
    );
  }
  checkExistingRdvByPatId(dateRdv:string):Observable<boolean>{
    return this.httpClient.post<boolean>(
      `${this.baseApiUrl}/RendreVous/checkRdvExist/${dateRdv}`,
      dateRdv
    );
  }
}
