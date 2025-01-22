import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';

  constructor() { }

  ngOnInit() {
  }

  onLogin() {
    if (this.username && this.password) {
      console.log('Nom d\'utilisateur:', this.username);
      console.log('Mot de passe:', this.password);
      alert('Connexion réussie !');
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

}
