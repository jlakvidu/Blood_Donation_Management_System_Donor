import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Hospital } from '../appointment/appointment.component';

export interface AppointmentRequest {
  patientName: string;
  appointmentDateTime: string;
  hospitalId: number;
  bloodType: string;
  contactNumber: string;
  emailAddress: string;
}

@Component({
  selector: 'app-place-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule
  ],
  templateUrl: './place-appointment.component.html',
  styleUrls: ['./place-appointment.component.css']
})
export class PlaceAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM'
  ];
  hospital: Hospital | null = null;
  private apiUrl = 'http://localhost:8080/appointments/create-appointments';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.appointmentForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bloodType: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      healthDeclaration: [false, Validators.requiredTrue]
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.hospital = navigation.extras.state['hospital'] as Hospital;
    }

    if (!this.hospital) {
      this.router.navigate(['/appointment']);
    }
  }

  ngOnInit(): void { }

  submitAppointment() {
    if (this.appointmentForm.valid && this.hospital) {
      const date = this.appointmentForm.get('date')?.value;
      const time = this.appointmentForm.get('time')?.value;
      const dateTime = new Date(date);

      const timeParts = time.match(/(\d+):(\d+) (AM|PM)/);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const period = timeParts[3];

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        dateTime.setHours(hours, minutes, 0);
      }

      const appointmentData: AppointmentRequest = {
        patientName: this.appointmentForm.get('fullName')?.value,
        appointmentDateTime: dateTime.toISOString(),
        hospitalId: this.hospital.id,
        bloodType: this.appointmentForm.get('bloodType')?.value,
        contactNumber: this.appointmentForm.get('phone')?.value,
        emailAddress: this.appointmentForm.get('email')?.value
      };

      this.http.post(this.apiUrl, appointmentData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Appointment Scheduled!',
            text: 'We will send you a confirmation email shortly.',
            confirmButtonColor: '#e41e31'
          });
          this.router.navigate(['/appointment']);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to schedule appointment. Please try again.',
            confirmButtonColor: '#e41e31'
          });
          console.error('Error creating appointment:', error);
        }
      });
    }
  }
}
