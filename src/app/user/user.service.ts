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

  /**
   * Configure les notifications push pour l'utilisateur.
   * Vérifie si l'utilisateur est authentifié, s'il est bien sur android ou ios, 
   * et gère les autorisations et l'abonnement aux notifications.
   * ATTENTION : Notification uniquement fonctionnelles sur Android
   */
  async setupNotifications() {
    console.log(this.authService.getToken());
    if (!this.authService.getToken()) {
      return;
    }

    console.log(Capacitor.getPlatform());
    if (Capacitor.getPlatform() == "web") {
      return;
    }

    //Checks nécessaire pour android >= API 33
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

  /**
   * Souscrit aux notifications push.
   * Lance l'enregistrement de l'appareil auprès de Firebase, puis s'abonne au topic correspondant a l'uuid de l'utilisateur connecté.
   * TODO : RAJOUTER UNE FONCTION FAISANT UNE DESINCRIPTION DES TOPICS EN CAS DE DECONNEXION DE L'UTILISATEUR.
   */
  subscribeToNotifications() {
    PushNotifications.register();

    FCM.subscribeTo({ topic: `testTopic` });

    FCM.getToken().then(e => {
      this.FCM = e.token
      console.log(e.token);
    })

    //L'application s'abonne au topic correspondant au uuid de l'utilisateur connecté.
    //Le serveur détermine ensuite a quel topic envoyer les notifications.
    this.authService.getUser().subscribe(e => {
      if (e) FCM.subscribeTo({ topic: e.uuid });
    })
  }

  /**
   * Récupère la liste des amis de l'utilisateur connecté (l'utilisateur est inclu).
   * @returns Un Observable contenant un tableau d'utilisateur (L'utilisateur est inclu).
   * Si l'utilisateur n'est pas authentifié, retourne une liste vide.
   */
  getFriends(): Observable<User[]> {
    if (!this.authService.getToken() || !this.authService.getUserValue()) {
      return from([]);
    } else {
      return this.apiService.get<User[]>(`user/friends/${this.authService.getUserValue()?.uuid}`)
    }
  }
}
