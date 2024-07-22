import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationUser} from 'src/app/models/api-model/authentication/ApplicationUser';
import { environment } from 'src/environments/environment.development';
import { UserResponse } from 'src/app/models/api-model/authentication/UserResponse.model';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private baseApiUrl = environment.baseApiUrl;
    private userSubject: BehaviorSubject<ApplicationUser | null>;
    public user: Observable<ApplicationUser| null>;

    constructor(
        private router: Router,
        private http: HttpClient

    ) {
        this.userSubject = new BehaviorSubject<ApplicationUser | null>(null);
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.baseApiUrl}/authentication/login`, { username, password }, { withCredentials: false })
            .pipe(map(user => {
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        this.http.post<any>(`${environment.baseApiUrl}/refreshtokens/revoke-all`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${environment.baseApiUrl}/refreshtokens/refresh-token`, {}, { withCredentials: false })
            .pipe(map((user) => {
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    // helper methods

    private refreshTokenTimeout?: NodeJS.Timeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        //const jwtBase64 = this.userValue!.AccessToken!.split('.')[1];
       // const jwtToken = JSON.parse(atob(jwtBase64));

        // set a timeout to refresh the token a minute before it expires
       // const expires = new Date(jwtToken.exp * 1000);
       // const timeout = expires.getTime() - Date.now() - (60 * 1000);
       // this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
    GetUsers(currentUserId:string):Observable<UserResponse[]>{
      return this.http.put<UserResponse[]>(
        `${this.baseApiUrl}/authentication/GetUsers/${currentUserId}`,
        currentUserId
      );
    }
    signOut() {

      this.userSubject.next(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("User");
      this.router.navigate(['/login']);
  }
}
