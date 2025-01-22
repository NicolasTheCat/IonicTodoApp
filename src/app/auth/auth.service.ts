import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, from, map, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentToken$ = new BehaviorSubject<string | null>(null);
  private currentUser$ = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<string> {
    /*
    return from(Promise.resolve("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEiLCJuYW1lIjoiTmljb2xhc1RoZUNhdCJ9.MR6HR-3Lne8K28oZ1zGZgqoyDtcIFl_3kvFI-E9dnQw"))
      .pipe(
        map(response => {
          this.currentToken$.next(response);
          this.currentUser$.next(jwtDecode(response));
          return response;
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          switch (err.status) {
            case 403:
              return throwError(() => new Error("Mauvais nom d'utilisateur/mot de passe"))

            default:
              return throwError(() => new Error("Une erreur inconnue est survenue, code : " + err.status))
          }
        })
      )
      */
    return this.http.post<string>('/api/login', { username, password })
      .pipe(
        map(response => {
          this.currentToken$.next(response);
          this.currentUser$.next(jwtDecode(response));
          return response;
        })
      ).pipe(
        catchError((err: HttpErrorResponse) => {
          switch (err.status) {
            case 403:
              return throwError(() => new Error("Mauvais nom d'utilisateur/mot de passe"))

            default:
              return throwError(() => new Error("Une erreur inconnue est survenue, code : " + err.status))
          }
        })
      )
  }

  createAccount(username: string, password: string): Observable<any> {
    /*
    return from(Promise.resolve("Account created"))
      .pipe(
        catchError((err: HttpErrorResponse) => {
          switch (err.status) {
            default:
              return throwError(() => new Error("Une erreur inconnue est survenue, code : " + err.status))
          }
        })
      )
      */
    return this.http.post<string>('/api/user', { username, password })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          switch (err.status) {
            default:
              return throwError(() => new Error("Une erreur inconnue est survenue, code : " + err.status))
          }
        })
      )
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    //TODO : Handle expiration on token
    return true;
  }

  getUser(): Observable<any | null> {
    return this.currentUser$.asObservable();
  }

  getToken(): string | null {
    return this.currentToken$.getValue();
  }
}