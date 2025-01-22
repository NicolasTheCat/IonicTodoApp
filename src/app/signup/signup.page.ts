import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  username: string = '';
  password: string = '';
  errMsg: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.username && this.password) {
      console.log('Nom d\'utilisateur:', this.username);
      console.log('Mot de passe:', this.password);
      this.authService.login(this.username, this.password).subscribe({
        next: (v) => this.router.navigate(['login', { accCreated: true }]),
        error: (err: Error) => {
          console.log(err);
          this.errMsg = err.message
        }
      })
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

}
