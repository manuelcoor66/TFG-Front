import { RouterModule, Routes } from '@angular/router';
import { AchievementsComponent } from './achievements/achievements.component';
import { AdminGuard } from '../services/admin.guard';
import { AppComponent } from './app.component';
import { AuthGuard } from '../services/auth.guard';
import { CreateLeagueComponent } from './league/create-league/create-league.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { LeagueDetailComponent } from './league/league-detail/league-detail.component';
import { LeaguesComponent } from './league/leagues.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from '../services/login.guard';
import { ManageUsersComponent } from './user/manage-users/manage-users.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { TicketsComponent } from './tickets/tickets.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/leagues',
    pathMatch: 'full',
  },
  {
    path: 'leagues',
    component: LeaguesComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'league/:id',
    component: LeagueDetailComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'create-league',
    component: CreateLeagueComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'achievements',
    component: AchievementsComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [LoginGuard, AdminGuard],
  },
  {
    path: 'create-league',
    component: CreateLeagueComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [LoginGuard],
  },
];

NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  declarations: [],
  bootstrap: [AppComponent],
  providers: [],
});

export class AppModule {}
