import { Injectable, OnInit } from '@angular/core';
import { User } from './user.type';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { ApiService } from '../api.service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  friendList: User[] = [];
  public FCM = "";

  constructor(private authService: AuthService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.setupNotifications()
  }

  async setupNotifications() {
    console.log(this.authService.getToken());
    if (!this.authService.getToken()) {
      return;
    }

    console.log(Capacitor.getPlatform());
    if (Capacitor.getPlatform() == "web") {
      return;
    }

    let hasPerms = await PushNotifications.checkPermissions();
    if (!hasPerms) {
      let request = await PushNotifications.requestPermissions();
      if (request.receive == "granted") {
        this.subscribeToNotifications();
      }
    } else {
      this.subscribeToNotifications();
    }

    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value)
      }
    );
  }

  subscribeToNotifications() {
    PushNotifications.register();

    FCM.subscribeTo({ topic: `testTopic` });

    FCM.getToken().then(e => {
      this.FCM = e.token
      console.log(e.token);
    })

    this.authService.getUser().subscribe(e => {
      if (e) FCM.subscribeTo({ topic: e.uuid });
    })
  }

  getFriends(): Observable<User[]> {
    if (!this.authService.getToken() || !this.authService.getUserValue()) {
      return from([]);
    } else {
      return this.apiService.get<User[]>(`user/friends/${this.authService.getUserValue()?.uuid}`)
    }
  }
}
