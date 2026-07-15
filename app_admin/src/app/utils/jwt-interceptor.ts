import { Inject, Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly tokenKey = 'travlr-token';

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthApi =
      request.url.includes('/login') ||
      request.url.includes('/register');

    const token = this.storage.getItem(this.tokenKey);

    if (token && !isAuthApi) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}

export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};