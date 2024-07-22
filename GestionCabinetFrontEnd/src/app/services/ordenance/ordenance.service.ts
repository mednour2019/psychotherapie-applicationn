import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRendezVousRequest } from 'src/app/models/api-model/Rdv/AddRendezVousRequest.model';
import { RendezVousResponse } from 'src/app/models/api-model/Rdv/RendezVousResponse.model';
import { UpdatedRendezVousRequest } from 'src/app/models/api-model/Rdv/UpdatedRendezVousRequest.model';
import { AddOrdenRequest } from 'src/app/models/api-model/ordenance/AddOrdenanceRequest.model';
import { OrdenResponse } from 'src/app/models/api-model/ordenance/ordenResponse.model';
import { UpdatedOrdenRequest } from 'src/app/models/api-model/ordenance/updateOrdenRequest.model';
import { patientResponse } from 'src/app/models/api-model/patient/patient-response.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrdenanceService {
  private baseApiUrl = environment.baseApiUrl;
  constructor(private httpClient: HttpClient) { }
  GetListOrde():Observable<OrdenResponse[]>{
    return this.httpClient.get<OrdenResponse[]>(
      `${this.baseApiUrl}/Odenance/getListOrd`
      );
  }
  AddOrd(ord: AddOrdenRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Odenance/addOrd',
      ord
    );
  }
  UpdateOrd(ord: UpdatedOrdenRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Odenance/Updateord',
      ord
    );
  }
  RemoveOrd(ordId:string):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/Odenance/RemoveOrde/${ordId}`,
      ordId
    );
  }
}
