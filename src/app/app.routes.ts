import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./customer-service/login/login.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Chat an agent of our company',
    component: HomeComponent ,
  },
  {
    path: 'login',
    title: 'Agent Log in',
    component: LoginComponent ,
  },
];
