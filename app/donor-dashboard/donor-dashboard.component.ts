import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent implements OnInit, AfterViewInit {
  sidebarActive: boolean = false;
  donationStats = {
    totalDonations: 12,
    nextDonation: '15 Apr 2024',
    achievementLevel: 'Gold Donor'
  };

  recentDonations = [
    {
      date: 'March 15, 2024',
      location: 'City Hospital',
      bloodType: 'A+',
      status: 'Completed'
    },
    {
      date: 'February 1, 2024',
      location: 'Blood Bank Center',
      bloodType: 'A+',
      status: 'Completed'
    },
    {
      date: 'April 15, 2024',
      location: 'Community Center',
      bloodType: 'A+',
      status: 'Scheduled'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.animateCounters();
  }

  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  private animateCounters(): void {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent || '0');
      let count = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const updateCount = () => {
        if (count < target) {
          count += increment;
          if (counter instanceof HTMLElement) {
            counter.innerText = Math.floor(count).toString();
          }
          requestAnimationFrame(updateCount);
        } else {
          if (counter instanceof HTMLElement) {
            counter.innerText = target.toString();
          }
        }
      };

      updateCount();
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}