import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _baseUrl = 'http://86.48.2.12:3000'; //IP de mon vps, merci de pas le surmener :c

  constructor(private http: HttpClient) { }

  /**
   * Effectue une requête GET à l'API.
   * @param endpoint Le chemin relatif de l'API (sans / au début)
   * @returns Un Observable contenant la réponse
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this._baseUrl}/${endpoint}`);
  }

  /**
   * Effectue une requête POST à l'API.
   * @param endpoint Le chemin relatif de l'API (sans / au début)
   * @param data Les données à envoyer dans le corps de la requête
   * @returns Un Observable contenant la réponse
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this._baseUrl}/${endpoint}`, data);
  }

  /**
   * Effectue une requête PUT à l'API.
   * @param endpoint Le chemin relatif de l'API (sans / au début)
   * @param data Les données à mettre à jour dans le corps de la requête
   * @returns Un Observable contenant la réponse
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this._baseUrl}/${endpoint}`, data);
  }

  /**
   * Effectue une requête DELETE à l'API.
   * @param endpoint Le chemin relatif de l'API (sans / au début)
   * @returns Un Observable contenant la réponse
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this._baseUrl}/${endpoint}`);
  }
}
