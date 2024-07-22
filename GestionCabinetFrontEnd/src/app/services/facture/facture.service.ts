import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRendezVousRequest } from 'src/app/models/api-model/Rdv/AddRendezVousRequest.model';
import { RendezVousResponse } from 'src/app/models/api-model/Rdv/RendezVousResponse.model';
import { UpdatedRendezVousRequest } from 'src/app/models/api-model/Rdv/UpdatedRendezVousRequest.model';
import { AddConsultationRequest } from 'src/app/models/api-model/consultation/AddConsultationRequest.model';
import { ConsultationResponse } from 'src/app/models/api-model/consultation/ConsultationResponse.model';
import { UpdatedConsultationRequest } from 'src/app/models/api-model/consultation/UpdatedConsultationRequest.model';
import { AddFactureRequest } from 'src/app/models/api-model/fact/AddFactureRequest.model';
import { factureResponse } from 'src/app/models/api-model/fact/factResponse.model';
import { updatedFactureRequest } from 'src/app/models/api-model/fact/updateFactRequest.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) { }

  GetListFacture():Observable<factureResponse[]>{
    return this.httpClient.get<factureResponse[]>(
      `${this.baseApiUrl}/Facture/getListFactures`
      );
  }
  AddFacture(fact: AddFactureRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Facture/addFact',
      fact
    );
  }
  UpdateFact(fact: updatedFactureRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/Facture/updateFacture',
      fact
    );
  }
  RemoveFact(factId:string):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/Facture/RemoveFact/${factId}`,
      factId
    );
  }
}
