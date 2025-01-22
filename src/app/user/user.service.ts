import { Injectable, OnInit } from '@angular/core';
import { User } from './user.type';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  DUMMY_FRIEND_LIST: User[] = [
    { uuid: "ff694e2e-4d5a-4221-b8e5-d74a8f03f8fe", name: 'Friend1', score: 10 },
    { uuid: "1008cfa4-af5c-445d-bf30-9b303adc2303", name: 'Friend2', score: 20 },
    { uuid: "04b99f94-cf86-4963-98c3-57a315da2442", name: 'Friend3', score: 30 },
  ]

  friendList: User[] = [];
  public FCM = "";

  constructor(private authService: AuthService) { }

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
      if (request.receive = 'denied') {
        return;
      }
    }

    PushNotifications.register();

    FCM.subscribeTo({ topic: `testTopic` });

    FCM.getToken().then(e => this.FCM = e.token)

    this.authService.getUser().subscribe(e => {
      if (e) FCM.subscribeTo({ topic: e.uuid });
    })

  }

  getFriends() {
    if (!this.authService.getToken()) {
      return [];
    }

    //add call to api
    return this.DUMMY_FRIEND_LIST;
  }
}
