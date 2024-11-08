import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DonorFormComponent } from "./donor-registration/donor-registration.component";
import { HeaderComponent } from './common/header/header.component';
import { DonorHealthTipsComponent } from './donor-health-tips/donor-health-tips.component';
import { AppointmentComponent } from './appointment/appointment.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DonorFormComponent,HeaderComponent,DonorHealthTipsComponent,AppointmentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Donor_Front_End';
}
