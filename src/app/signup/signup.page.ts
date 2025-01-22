import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  username: string = '';
  password: string = '';

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.username && this.password) {
      console.log('Nom d\'utilisateur:', this.username);
      console.log('Mot de passe:', this.password);
      alert('Inscription réussie !');
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

}
