import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './shared/material.module';
import {LoginComponent} from "./pages/auth/login/login.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {CommonModule} from "@angular/common";
//import {AuthRoutingModule} from "./auth/auth-routing.module";
import {SharedModule} from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent, HomeComponent,LoginComponent,RegisterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    CoreModule,
    MaterialModule,
    CommonModule,
    //AuthRoutingModule,
    SharedModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
