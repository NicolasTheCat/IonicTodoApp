import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  errMsg: string = '';
  isAccCreated: boolean = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const accCreated = this.route.snapshot.paramMap.get('accCreated');
    if (accCreated == "true") {
      this.isAccCreated = true;
    }
  }

  onLogin() {
    if (this.username && this.password) {
      console.log('Nom d\'utilisateur:', this.username);
      console.log('Mot de passe:', this.password);
      this.authService.login(this.username, this.password).subscribe({
        next: (v) => this.router.navigate(['leaderboard']),
        error: (err: Error) => {
          console.log(err);
          this.errMsg = err.message
        }
      })
    } else {
      this.errMsg = "Veuillez remplir tous les champs"
    }
  }

}
