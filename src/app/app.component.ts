import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  routes: Route[] = [];
  _hiddenRoutes: string[] = [
    '',
    'signup',
    'login'
  ];

  constructor(private router: Router) {
    this.routes = this.router.config.filter(route => !this._hiddenRoutes.includes(route.path ?? 'NON_APPLICABLE'));
  }
}
