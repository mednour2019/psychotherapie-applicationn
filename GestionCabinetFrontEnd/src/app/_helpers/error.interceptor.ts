import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,private router:Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) ) {
                // auto logout if 401 or 403 response returned from api
                //this.authenticationService.logout();
                localStorage.removeItem("accessToken");
                this.router.navigateByUrl("/login");
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            //console.error(err);
            return throwError(() => error);
        }))
    }
}
