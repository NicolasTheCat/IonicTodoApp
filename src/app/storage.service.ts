import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!this._storage) {
      await this.init();
    }
    return this._storage?.get(key) ?? undefined;
  }

  remove(key: string) {
    this._storage?.remove(key);
  }
}