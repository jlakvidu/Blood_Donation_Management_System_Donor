import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

export interface Hospital {
  id: number;
  name: string;
  type: string;
  district: string;
  address: string;
  contactNumber: string;
  emailAddress: string;
  registrationNumber: string;
  bloodBankLicenseNumber: string;
  bloodBankCapacity: string;
  operatingDaysAndHours: string;
  specialInstructions?: string;
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatTooltipModule
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  districts: string[] = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale',
    'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
    'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya', 'Trincomalee',
    'Batticaloa', 'Ampara', 'Kurunegala', 'Puttalam', 'Anuradhapura',
    'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  selectedDistrict: string = '';
  hospitals: Hospital[] = [];
  searchPerformed: boolean = false;
  isLoading: boolean = false;
  searchText: string = '';
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {

  }

  clearSearch() {
    Swal.fire({
      title: 'Clear Search?',
      text: 'This will clear all search results',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.searchText = '';
        this.selectedDistrict = '';
        this.hospitals = [];
        this.searchPerformed = false;
      }
    });
  }

  searchHospitals() {
    if (!this.selectedDistrict && !this.searchText) {
      Swal.fire({
        title: 'Input Required',
        text: 'Please enter a district name or select from the dropdown',
        icon: 'warning'
      });
      return;
    }

    this.isLoading = true;
    this.searchPerformed = true;
    const district = this.selectedDistrict || this.searchText;

    this.http.get<Hospital[]>(`${this.baseUrl}/hospital/get-hospital-by-district/${district}`)
      .subscribe({
        next: (response) => {
          this.hospitals = response;
          this.isLoading = false;
          if (response.length > 0) {
            Swal.fire({
              title: 'Success!',
              text: `Found ${response.length} hospitals in ${district}`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          }
        },
        error: (error) => {
          console.error('Error fetching hospitals:', error);
          this.hospitals = [];
          this.isLoading = false;
          Swal.fire({
            title: 'Error!',
            text: 'Failed to fetch hospitals. Please try again.',
            icon: 'error'
          });
        }
      });
  }

  bookAppointment(hospital: Hospital) {
    Swal.fire({
      title: 'Book Appointment',
      html: `Do you want to book an appointment at ${hospital.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, book it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/place-appointment'], {
          state: { hospital: hospital }
        });
      }
    });
  }

  viewDetails(hospital: Hospital) {
    Swal.fire({
      title: '',
      html: `
        <div class="hospital-details-modal">
          <div class="modal-header">
            <h2>${hospital.name}</h2>
            <p class="hospital-type">${hospital.type} - ${hospital.district}</p>
          </div>
          
          <div class="modal-content">
            <div class="detail-group">
              <div class="detail-item">
                <i class="material-icons">location_on</i>
                <div class="detail-text">
                  <label>Address</label>
                  <p>${hospital.address}</p>
                </div>
              </div>
              
              <div class="detail-item">
                <i class="material-icons">phone</i>
                <div class="detail-text">
                  <label>Contact</label>
                  <p>${hospital.contactNumber}</p>
                </div>
              </div>
              
              <div class="detail-item">
                <i class="material-icons">email</i>
                <div class="detail-text">
                  <label>Email</label>
                  <p>${hospital.emailAddress}</p>
                </div>
              </div>
            </div>

            <div class="detail-group">
              <div class="detail-item">
                <i class="material-icons">access_time</i>
                <div class="detail-text">
                  <label>Operating Hours</label>
                  <p>${hospital.operatingDaysAndHours}</p>
                </div>
              </div>
              
              <div class="detail-item">
                <i class="material-icons">local_hospital</i>
                <div class="detail-text">
                  <label>Registration Number</label>
                  <p>${hospital.registrationNumber}</p>
                </div>
              </div>
            </div>

            <div class="detail-group blood-bank">
              <div class="detail-item">
                <i class="material-icons">water_drop</i>
                <div class="detail-text">
                  <label>Blood Bank License</label>
                  <p>${hospital.bloodBankLicenseNumber}</p>
                </div>
              </div>
              
              <div class="detail-item">
                <i class="material-icons">inventory_2</i>
                <div class="detail-text">
                  <label>Blood Bank Capacity</label>
                  <p>${hospital.bloodBankCapacity}</p>
                </div>
              </div>
            </div>

            ${hospital.specialInstructions ? `
              <div class="special-notice">
                <i class="material-icons">info</i>
                <div class="detail-text">
                  <label>Special Instructions</label>
                  <p>${hospital.specialInstructions}</p>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `,
      width: '700px',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        container: 'hospital-details-container',
        popup: 'hospital-details-popup',
        closeButton: 'details-close-button'
      }
    });
  }
}
