import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};