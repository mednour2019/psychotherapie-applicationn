import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddPatientRequest } from 'src/app/models/api-model/patient/AddPatientRequest.model';
import { UpdatedPatientRequest } from 'src/app/models/api-model/patient/UpdatedPatienRequest.model';
import { patientResponse } from 'src/app/models/api-model/patient/patient-response.model';
import { responsePieChart } from 'src/app/models/api-model/reportChart/respnse-pie-chart.model';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseApiUrl = environment.baseApiUrl;
  constructor(private httpClient: HttpClient) { }

  GetListPatients():Observable<patientResponse[]>{
    return this.httpClient.get<patientResponse[]>(
      `${this.baseApiUrl}/Patient/getListPatients`
      );
  }
  AddPatient(patient: AddPatientRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Patient/addPatient',
      patient
    );
  }
  updatePatient(patient: UpdatedPatientRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Patient/UpdatePatient',
      patient
    );
  }
  RemovePatient(PatientId:string):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/Patient/RemovePatientById/${PatientId}`,
      PatientId
    );
  }
  getPatientByFactrId(fctrId:string):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/Patient/getPatByFactr/${fctrId}`,
      fctrId
    );
  }
  GetNumbPatients():Observable<number>{
    return this.httpClient.get<number>(
      `${this.baseApiUrl}/Patient/getNumberPatients`
      );
  }
  GetSexPatPieChart():Observable<responsePieChart[]>{
    return this.httpClient.get<responsePieChart[]>(
      `${this.baseApiUrl}/Patient/getSexPatPieChart`
      );
  }

}
