import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DonorProfile {
  id: number;
  name: string;
  emailAddress?: string;
  contactNumber?: string;
  bloodType: string;
  dob: string;
  age: number;
  address: string;
  district: string;
  profileImagePath?: string;
  totalDonations?: number;
  lastDonation?: string;
  nextEligibleDate?: string;
  medicalHistory?: Array<{
    name: string;
    hasCondition: boolean;
  }>;
  donationHistory?: Array<{
    date: string;
    location: string;
    type: string;
    status: string;
  }>;
}

@Component({
  selector: 'app-donor-profile',
  templateUrl: './donor-profile.component.html',
  styleUrls: ['./donor-profile.component.css'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, RouterLink]
})
export class DonorProfileComponent implements OnInit {
  donor: DonorProfile | any = {};
  isLoading = true;
  public apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDonorProfile();
  }

  private loadDonorProfile(): void {
    const email = localStorage.getItem('userEmailAddress');

    if (email) {
      this.isLoading = true;
      this.http.get<any>(`http://localhost:8080/donor/profile/${email}`)
        .subscribe({
          next: (response) => {
            console.log('Raw response:', response);

            this.donor = {
              id: response.id,
              name: response.name,
              emailAddress: response.emailAddress,
              contactNumber: response.contactNumber,
              bloodType: response.bloodType,
              dob: response.dob,
              age: response.age,
              address: response.address,
              district: response.district,
              profileImagePath: response.profileImagePath,
              totalDonations: response.totalDonations || 0,
              lastDonation: response.lastDonation || 'No donations yet',
              nextEligibleDate: response.nextEligibleDate || 'Eligible now',
              medicalHistory: response.medicalHistory || [],
              donationHistory: response.donationHistory || []
            };

            console.log('Mapped donor data:', {
              emailAddress: this.donor.emailAddress,
              contactNumber: this.donor.contactNumber,
              bloodType: this.donor.bloodType,
              profileImagePath: this.donor.profileImagePath
            });

            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading donor profile:', error);
            this.isLoading = false;
          }
        });
    }
  }

  editContactInfo(): void {
    console.log('Editing contact info');
  }

  editPersonalInfo(): void {
    console.log('Editing personal info');
  }

  editMedicalHistory(): void {
    console.log('Editing medical history');
  }

  deleteDonorById(id: any) {
    if (!id) {
      alert('Error: Invalid donor ID!');
      return;
    }

    const confirmDelete = confirm(
      'Warning: Are you sure you want to delete your account?\n\n' +
      '• This action cannot be undone\n' +
      '• All your donor information will be permanently deleted\n' +
      '• You will need to register again to donate blood'
    );

    if (confirmDelete) {
      this.http.delete(`http://localhost:8080/donor/delete-donor-by-id/${id}`).subscribe({
        next: (response) => {
          alert('Account deleted successfully!');
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again later.');
        }
      });
    }
  }

  handleImageError(event: any): void {
    event.target.style.backgroundImage = 'url(assets/images/default-profile.jpg)';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select an image file', 'Close', { duration: 3000 });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.snackBar.open('File size should be less than 10MB', 'Close', { duration: 3000 });
        return;
      }

      this.uploadImage(file);
    }
  }

  private uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('donorId', this.donor.id.toString());

    this.isLoading = true;

    this.http.post(`${this.apiUrl}/donor/upload-profile-image`, formData)
      .subscribe({
        next: (response: any) => {
          this.donor.profileImagePath = response.profileImagePath;
          localStorage.setItem('donorProfileImage', response.profileImagePath);
          window.dispatchEvent(new Event('donorProfileImageUpdated'));
          this.snackBar.open('Profile image updated successfully', 'Close', { duration: 3000 });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.snackBar.open('Failed to upload image. Please try again.', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }
}
