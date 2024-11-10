import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DonorFormComponent } from "./donor-form/donor-form.component";
import { HeaderComponent } from './common/header/header.component';
import { DonorHealthTipsComponent } from './donor-health-tips/donor-health-tips.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { FooterComponent } from './common/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DonorFormComponent,HeaderComponent,DonorHealthTipsComponent,AppointmentComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Donor_Front_End';
}
