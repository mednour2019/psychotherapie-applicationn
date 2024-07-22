import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedApiMethodsService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) { }

}
