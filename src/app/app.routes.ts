import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from '../services/auth.guard';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from '../services/login.guard';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SubscriptionComponent } from './subscription/subscription.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
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
    path: 'subscription',
    component: SubscriptionComponent,
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [AuthGuard],
  },
];

NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  declarations: [],
  bootstrap: [AppComponent],
  providers: [],
});

export class AppModule {}
