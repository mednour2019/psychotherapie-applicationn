import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { environment } from 'src/environments/environment.development';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        console.log('user is ',user);
        const isLoggedIn = user?.AccessToken;
        const isApiUrl = request.url.startsWith(environment.baseApiUrl);
        if (isLoggedIn && isApiUrl) {
            console.log('im in exccess token');
            request = request.clone({

                //setHeaders: { Authorization: `Bearer ${user.AccessToken}` }
               setHeaders: { Authorization: `${user.AccessToken}` }

            });
        }

        return next.handle(request);
    }
}
