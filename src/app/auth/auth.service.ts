import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, from, map, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { User } from "../user/user.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentToken$ = new BehaviorSubject<string | null>(null);
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) { }

  /**
   * Méthode pour se connecter avec un nom d'utilisateur et un mot de passe.
   * Envoie une requête POST au backend pour obtenir un jeton JWT.
   * @param username Le nom d'utilisateur
   * @param password Le mot de passe
   * @returns Un Observable contenant le jeton JWT
   */
  login(username: string, password: string): Observable<string> {
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

  /**
   * Méthode pour créer un nouveau compte utilisateur.
   * @param username Le nom d'utilisateur
   * @param password Le mot de passe
   * @returns Un Observable renvoyant la réponse du serveur
   */
  createAccount(username: string, password: string): Observable<any> {
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

  /**
   * Vérifie si l'utilisateur est authentifié.
   * @returns `true` si un token est présent, `false` sinon
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    //TODO : Handle expiration on token
    return true;
  }

  /**
   * Renvoie un Observable contenant les informations de l'utilisateur ou `null` s'il n'est pas connecté.
   * @returns Un Observable contenant les informations de l'utilisateur ou `null`
   */
  getUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  /**
   * Récupère le jeton JWT actuellement stocké.
   * @returns Le jeton JWT ou `null` s'il n'est pas défini
   */
  getToken(): string | null {
    return this.currentToken$.getValue();
  }
}