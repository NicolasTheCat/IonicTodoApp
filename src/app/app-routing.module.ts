import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'todo',
    loadChildren: () => import('./todo-list/todo-list.module').then(m => m.TodoListModule)
  },
  {
    path: '',
    redirectTo: 'todo',
    pathMatch: 'full'
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarPageModule)
  },
  {
    path: 'leaderboard',
    loadChildren: () => import('./leaderboard/leaderboard.module').then( m => m.LeaderboardPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
