import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

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
  private imageTimestamp: string;
  showHeader = false;
  private excludedRoutes = ['/login', '/donor-form', '/signin', '/donor-registration'];

  constructor(
    private router: Router,
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.profileImageListener = () => {
      this.loadDonorProfile();
    };
    window.addEventListener('donorProfileImageUpdated', this.profileImageListener);
    window.addEventListener('storage', this.checkAuthStatus.bind(this));
    this.imageTimestamp = Date.now().toString();
    this.checkRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  }

  ngOnInit() {
    this.loadDonorProfile();
    this.checkRoute();
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
            this.imageTimestamp = Date.now().toString();
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
    event.target.style.backgroundImage = 'url(assets/images/default-profile.jpg)';
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        sessionStorage.clear();
        this.destroy$.next();
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  navigateToAppointment() {
    this.router.navigate(['/appointment']);
    this.isSidebarOpen = false;
  }

  private checkAuthStatus(): void {
    const isLoggedIn = localStorage.getItem('userEmailAddress') !== null;
    const currentUrl = this.router.url;
    const isExcludedRoute = this.excludedRoutes.some(route => currentUrl.includes(route));
    
    this.showHeader = isLoggedIn && !isExcludedRoute;
    this.updateHeaderVisibility();
  }

  getProfileImageUrl(): string {
    if (this.donor.profileImagePath) {
      return `${this.apiUrl}${this.donor.profileImagePath}?t=${this.imageTimestamp}`;
    }
    return 'assets/images/default-profile.jpg';
  }

  private checkRoute() {
    const currentUrl = this.router.url;
    const isExcludedRoute = this.excludedRoutes.some(route => currentUrl.includes(route));
    const isLoggedIn = localStorage.getItem('userEmailAddress') !== null;
    
    this.showHeader = !isExcludedRoute && isLoggedIn;
    this.updateHeaderVisibility();
  }

  private updateHeaderVisibility() {
    const header = this.el.nativeElement.querySelector('.header-container');
    if (header) {
      this.renderer.setStyle(header, 'display', this.showHeader ? 'block' : 'none');
    }
  }
}