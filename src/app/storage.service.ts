import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  /**
   * Constructeur qui appelle la méthode init de `@ionic/storage-angular`.
   * Il est impossible d'utiliser Ionic Storage sans cette initialisation.
   * 
   * ATTENTION : Le constructeur appelle une fonction asynchrone, mais ne peut pas être await car il s'agit d'un constructeur. 
   *             Cela à pour effet de causer des bugs si l'ont utilise les fonctions de get/set du storage avant qu'il soit set.
   *             Un moyen de prévention a été rajouté sur get, mais pas sur set, donc ne pas set de variables dés le chargement d'une page.
   */
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * Enregistre une valeur dans le stockage.
   * @param key La clé sous laquelle la valeur sera enregistrée
   * @param value La valeur à stocker (peut être de tout type)
   */
  set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  /**
   * Récupère une valeur à partir du stockage.
   * Si le stockage n'est pas initialisé lors de l'appel de cette fonction, il sera initialisé.
   * TODO : Parcourir le lifecycle de ionic pour comprendre d'où vient ce quirk, et le corriger.
   * @param key La clé associée à la valeur recherchée
   * @returns Une promesse résolvant la valeur recherchée ou undefined si la clé n'existe pas
   */
  async get<T>(key: string): Promise<T | undefined> {
    if (!this._storage) {
      await this.init();
    }
    return this._storage?.get(key) ?? undefined;
  }

  /**
   * Récupère une valeur à partir du stockage.
   * @param key La clé associée à la valeur recherchée
   */
  remove(key: string) {
    this._storage?.remove(key);
  }
}