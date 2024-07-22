import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationUser} from 'src/app/models/api-model/authentication/ApplicationUser';
import { environment } from 'src/environments/environment.development';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<ApplicationUser[]>(`${environment.baseApiUrl}/userlist/userlist`);
    }
}
