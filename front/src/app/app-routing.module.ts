import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import {LoginComponent} from "./pages/auth/login/login.component";
import {RegisterComponent} from "./pages/auth/register/register.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
   { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'mdd',
    loadChildren: () => import('./mdd/mdd.module').then((m) => m.MddModule),
  },
   { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
