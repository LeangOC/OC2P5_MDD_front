import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
userEmail: string = 'nom@Openclassrooms';
userName: string = '';
onSubmitForme(): void {
  console.log(this.userEmail);
  console.log("Bonjour : " + this.userName);
}


}
