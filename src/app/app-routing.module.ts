import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'enter-app',
    pathMatch: 'full'
  },
  {
    path: 'game-lobby',
    loadChildren: () => import('./game-lobby/game-lobby.module').then( m => m.GameLobbyPageModule)
  },

  {
    path: 'game-select',
    loadChildren: () => import('./game-select/game-select.module').then( m => m.GameSelectPageModule)
  },
  {
    path: 'game-info',
    loadChildren: () => import('./game-info/game-info.module').then( m => m.GameInfoPageModule)
  },
  {
    path: 'game-closing',
    loadChildren: () => import('./game-closing/game-closing.module').then( m => m.GameClosingPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./enter-app/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./enter-app/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'enter-app',
    loadChildren: () => import('./enter-app/enter-app.module').then( m => m.EnterAppPageModule)
  },
  {
    path: 'username-select',
    loadChildren: () => import('./username-select/username-select.module').then( m => m.UsernameSelectPageModule)
  },
  {
    path: 'game-create',
    loadChildren: () => import('./game-create/game-create.module').then( m => m.GameCreatePageModule)
  },
  {
    path: 'play',
    loadChildren: () => import('./play/play.module').then( m => m.PlayPageModule)
  },

  {
    path: 'player-info',
    loadChildren: () => import('./player-info/player-info.module').then( m => m.PlayerInfoPageModule)
  },
  {
    path: 'achievement',
    loadChildren: () => import('./achievement/achievement.module').then( m => m.AchievementPageModule)
  },

  {
    path: 'statistics',
    loadChildren: () => import('./statistics/statistics.module').then( m => m.StatisticsPageModule)
  },

  {
    path: 'avatar',
    loadChildren: () => import('./home/avatar/avatar.module').then(m => m.AvatarPageModule)
  },
  {
    path: 'game-end',
    loadChildren: () => import('./game-end/game-end.module').then( m => m.GameEndPageModule)
  },
  {
    path: 'data-protection',
    loadChildren: () => import('./data-protection/data-protection.module').then( m => m.DataProtectionPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
