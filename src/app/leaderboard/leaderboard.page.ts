import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../user/user.type';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  friendList: User[] = [];
  sort: FriendSort = FriendSort.SCORE;
  _sortEnum = FriendSort;

  ngOnInit() {
    if (this.authService.getToken() == null) {
      this.router.navigate(['login'])
    }
    this.friendList = this.userService.getFriends()
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
