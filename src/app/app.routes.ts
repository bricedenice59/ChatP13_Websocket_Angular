import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {ChatComponent} from "./pages/chat/chat.component";

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
    path: 'login',
    title: 'Agent Log in',
    component: LoginComponent ,
  },
  {
    path: 'chat',
    title: 'Chat',
    component: ChatComponent ,
  },
];
