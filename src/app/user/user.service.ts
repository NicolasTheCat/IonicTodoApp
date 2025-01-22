import { Injectable } from '@angular/core';
import { User } from './user.type';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService) { }

  DUMMY_FRIEND_LIST: User[] = [
    { uuid: uuidv4(), name: 'Friend1', score: 10 },
    { uuid: uuidv4(), name: 'Friend2', score: 20 },
    { uuid: uuidv4(), name: 'Friend3', score: 30 },
  ]

  getFriends() {
    if (!this.authService.getToken()) {
      return [];
    }

    //add call to api
    return this.DUMMY_FRIEND_LIST;
  }
}
