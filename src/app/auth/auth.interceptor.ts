import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  /**
   * Méthode d'interception des requêtes HTTP.
   * Ajoute un en-tête `Authorization` avec le jeton JWT si celui-ci existe.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (!token) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${token}`
      )
    });

    return next.handle(authReq);
  }
}