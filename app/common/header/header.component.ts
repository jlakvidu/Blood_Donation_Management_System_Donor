import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

interface DonorProfile {
  name: string;
  bloodType: string;
  profileImagePath?: string;
  totalDonations?: number;
  nextEligibleDate?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  donor: DonorProfile = {
    name: '',
    bloodType: '',
    profileImagePath: '',
    totalDonations: 0,
    nextEligibleDate: ''
  };
  apiUrl = 'http://localhost:8080';
  private profileImageListener: any;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.profileImageListener = () => {
      this.loadDonorProfile();
    };
    window.addEventListener('donorProfileImageUpdated', this.profileImageListener);
  }

  ngOnInit() {
    this.loadDonorProfile();
  }

  ngOnDestroy() {
    this.destroy$.complete();
    window.removeEventListener('donorProfileImageUpdated', this.profileImageListener);
  }

  private loadDonorProfile(): void {
    const email = localStorage.getItem('userEmailAddress');

    if (email) {
      this.http.get<any>(`${this.apiUrl}/donor/profile/${email}`)
        .subscribe({
          next: (response) => {
            this.donor = {
              name: response.name || 'Guest User',
              bloodType: response.bloodType || 'Unknown',
              profileImagePath: response.profileImagePath,
              totalDonations: response.totalDonations || 0,
              nextEligibleDate: response.nextEligibleDate
            };
            console.log('Donor profile loaded:', this.donor);
          },
          error: (error) => {
            console.error('Error loading donor profile:', error);
          }
        });
    }
  }

  formatNextDonationDate(): string {
    if (!this.donor.nextEligibleDate) return 'Not Set';
    const date = new Date(this.donor.nextEligibleDate);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short'
    });
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-profile.jpg';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateToProfile() {
    this.router.navigate(['/donor-profile']);
    this.isSidebarOpen = false;
  }

  navigateToNotifications() {
    this.router.navigate(['/notifications']);
    this.isSidebarOpen = false;
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.destroy$.next();
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    });
  }

  navigateToAppointment() {
    this.router.navigate(['/appointment']);
    this.isSidebarOpen = false;
  }

  getTimestamp(): string {
    return new Date().getTime().toString();
  }
}