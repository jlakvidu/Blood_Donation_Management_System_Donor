import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: string;
  recipientEmail: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  selectedNotification: Notification | null = null;
  showModal = false;
  isLoading = false;
  error: string | null = null;
  private apiUrl = 'http://localhost:8080/notifications';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/donor-sign-in']);
      return;
    }
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.error = null;

    const donorEmail = localStorage.getItem('userEmailAddress');

    if (!donorEmail) {
      this.error = 'User email not found. Please login again.';
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Fetching notifications for:', donorEmail);

    this.http.get<Notification[]>(`${this.apiUrl}/user/${donorEmail}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Raw response:', response);
          if (Array.isArray(response)) {
            this.notifications = response;
          } else {
            console.error('Response is not an array:', response);
            this.error = 'Invalid response format';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error details:', error);
          this.error = `Failed to load notifications: ${error.message}`;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          console.log('Request completed');
        }
      });
  }

  markAsRead(notificationId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}, { headers })
      .subscribe({
        next: () => {
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.isRead = true;
          }
        },
        error: (error) => {
          console.error('Error marking as read:', error);
        }
      });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  openNotificationDetails(notification: Notification) {
    this.selectedNotification = notification;
    this.showModal = true;
    if (!notification.isRead) {
      this.markAsRead(notification.id);
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedNotification = null;
  }

  deleteNotification(notificationId: number) {
    console.log('Attempting to delete notification:', notificationId);

    const confirmDelete = confirm('Are you sure you want to delete this notification?');

    if (!confirmDelete) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
    if (notificationElement) {
      notificationElement.classList.add('deleting');
    }

    this.http.delete(`${this.apiUrl}/${notificationId}`, {
      headers,
      observe: 'response',
      responseType: 'text'
    })
      .subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          console.log('Response status:', response.status);

          if (response.status === 200) {
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            console.log('Notifications after delete:', this.notifications);
          } else {
            console.warn('Unexpected response status:', response.status);
            throw new Error('Failed to delete notification');
          }
        },
        error: (error) => {
          console.error('Full error object:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);

          if (notificationElement) {
            notificationElement.classList.remove('deleting');
          }
          alert(`Failed to delete notification: ${error.message}`);
        }
      });
  }
}