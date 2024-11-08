import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface Donor {
  id: number;
  name: string;
  dob: Date;
  age: number;
  bloodType: string;
  contactNumber: string;
  emailAddress: string;
  district: string;
  address: string;
  password: string;
  profileImagePath?: string;
}

@Component({
  selector: 'app-donor-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './donor-edit.component.html',
  styleUrl: './donor-edit.component.css'
})
export class DonorEditComponent implements OnInit {
  public donor: Donor = {
    id: 0,
    name: '',
    dob: new Date(),
    age: 0,
    bloodType: '',
    contactNumber: '',
    emailAddress: '',
    district: '',
    address: '',
    password: ''
  };

  districts: string[] = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadDonorProfile();
  }

  private loadDonorProfile() {
    const email = localStorage.getItem('userEmailAddress');

    if (email) {
      this.http.get<any>(`http://localhost:8080/donor/profile/${email}`)
        .subscribe({
          next: (response) => {
            console.log('Donor data loaded:', response);

            if (!response) {
              console.error('No donor data received');
              return;
            }

            const dobDate = response.dob ? new Date(response.dob) : new Date();

            const district = response.district && this.districts.includes(response.district)
              ? response.district
              : '';

            this.donor = {
              id: response.id || 0,
              name: response.name || '',
              dob: dobDate,
              age: response.age || 0,
              bloodType: response.bloodType || '',
              contactNumber: response.contactNumber || '',
              emailAddress: response.emailAddress || '',
              district: district,
              address: response.address || '',
              password: response.password || '',
              profileImagePath: response.profileImagePath || ''
            };

            console.log('Donor object after mapping:', this.donor);
          },
          error: (error) => {
            console.error('Error loading donor profile:', error);
            alert('Error loading donor profile. Please try again.');
          }
        });
    } else {
      console.error('No email found in localStorage');
      alert('Please log in to access your profile.');
    }
  }

  updateDonor(donor: Donor) {
    console.log('Updating donor:', donor);
    this.donor = { ...donor };
  }

  saveDonor() {
    console.log('Saving donor:', this.donor);

    if (!this.donor.district || this.donor.district.trim() === '') {
      alert("Please select a district");
      return;
    }

    if (!this.donor.name || !this.donor.emailAddress || !this.donor.contactNumber ||
      !this.donor.bloodType || !this.donor.address) {
      alert("Please fill in all required fields");
      return;
    }

    const formattedDob = this.donor.dob instanceof Date
      ? this.donor.dob.toISOString().split('T')[0]
      : this.donor.dob;

    const requestBody = {
      id: this.donor.id,
      name: this.donor.name.trim(),
      dob: formattedDob,
      age: this.donor.age,
      bloodType: this.donor.bloodType,
      contactNumber: this.donor.contactNumber.trim(),
      emailAddress: this.donor.emailAddress.trim(),
      district: this.donor.district.trim(),
      address: this.donor.address.trim(),
      password: this.donor.password,
      profileImagePath: this.donor.profileImagePath
    };

    console.log('Request body:', requestBody);

    this.http.put<{ message: string }>("http://localhost:8080/donor/update-donor", requestBody)
      .subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          alert(response.message || "Donor Updated Successfully!");
          this.router.navigate(['/donor-profile']); // Navigate back to profile
        },
        error: (error) => {
          console.error('Error updating donor:', error);
          if (error.status === 200 || error.status === 202) {
            // If the update was actually successful despite the error
            alert("Donor Updated Successfully!");
            this.router.navigate(['/donor-profile']);
          } else {
            alert(error.error?.message || "Error updating donor. Please try again.");
          }
        }
      });
  }
}
