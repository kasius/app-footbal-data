import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetasFacade } from '../store/meta.facade';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  tokenApi = null;

  constructor(
    private router: Router,
    private metaFacade: MetasFacade
  ) {
    this.metaFacade.getTokenApi$()
      .subscribe(tokenApi => this.tokenApi = tokenApi);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('/login')) {
      let token = this.tokenApi;
      req = req.clone({
        setHeaders: {
          'X-Auth-Token': `${token}`
        }
      });
    }

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/app/home']);
          }
        }
      })
    );
  }
}
