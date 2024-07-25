import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {ChatComponent} from "./pages/chat/chat.component";
import {unAuthGuard} from "./core/guards/unauth.guard";
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Chat an agent of our customer service',
    component: HomeComponent ,
  },
  {
    canActivate: [unAuthGuard],
    path: 'login',
    title: 'Agent Log in',
    component: LoginComponent ,
  },
  {
    canActivate: [authGuard],
    path: 'chat',
    title: 'Chat',
    component: ChatComponent ,
  },
];
