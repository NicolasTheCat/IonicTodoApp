import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../user/user.type';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements ViewDidEnter {

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  friendList: User[] = [];
  sort: FriendSort = FriendSort.SCORE;
  _sortEnum = FriendSort;

  ionViewDidEnter() {
    if (this.authService.getToken() == null) {
      this.router.navigate(['login'])
    } else {
      this.userService.getFriends().subscribe(e => this.friendList = e);
      this.userService.setupNotifications()
    }
  }

  getFriends() {
    switch (this.sort) {
      case FriendSort.NAME: return this.friendList.sort((a, b) => a.name >= b.name ? 1 : -1);
      case FriendSort.SCORE: return this.friendList.sort((a, b) => b.score - a.score);
    }
  }
}

enum FriendSort {
  SCORE,
  NAME
}
