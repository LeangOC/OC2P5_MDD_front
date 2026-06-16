import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
userEmail: string = 'nom@Openclassrooms';
userName: string = '';
onSubmitForme(): void {
  console.log(this.userEmail);
  console.log("Bonjour : " + this.userName);
}


}
