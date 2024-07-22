
import { catchError, of } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

export function appInitializer(authenticationService: AuthenticationService) {
    return () => authenticationService.refreshToken()
        .pipe(
            // catch error to start app on success or failure
            catchError(() => of())
        );
}
