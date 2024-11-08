import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface EmergencyRequest {
  id: number;
  patientName: string;
  bloodType: string;
  hospital: string;
  hospitalEmail: string;
  contactNumber: string;
  unitsNeeded: number;
  urgencyLevel: string;
  description: string;
  imagePath: string;
  createdAt: string;
  district: string;
}

@Component({
  selector: 'app-view-emerganzy-blood-need',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './view-emerganzy-blood-need.component.html',
  styleUrl: './view-emerganzy-blood-need.component.css'
})
export class ViewEmerganzyBloodNeedComponent implements OnInit {
  loading = false;
  otherRequests: EmergencyRequest[] = [];
  loggedInHospitalEmail: string = '';
  searchDistrict: string = '';

  get filteredRequests(): EmergencyRequest[] {
    if (!this.searchDistrict) {
      return this.otherRequests;
    }
    return this.otherRequests.filter(request => 
      request.district.toLowerCase().includes(this.searchDistrict.toLowerCase())
    );
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggedInHospitalEmail = localStorage.getItem('hospitalEmailAddress') || '';
    this.loadEmergencyRequests();
  }

  loadEmergencyRequests() {
    this.loading = true;
    this.http.get<EmergencyRequest[]>('http://localhost:8080/api/emergency').subscribe({
      next: (data) => {
        this.otherRequests = data.filter(req => req.hospitalEmail !== this.loggedInHospitalEmail);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading emergency requests:', error);
        this.showErrorAlert('Error loading emergency requests');
        this.loading = false;
      }
    });
  }

  initiateCall(contactNumber: string) {
    const confirmed = confirm('Do you want to call this contact number?');
    if (confirmed) {
      window.location.href = `tel:${contactNumber}`;
    }
  }

  shareRequest(request: EmergencyRequest) {
    const shareText = `🚨 URGENT BLOOD NEED 🚨

🏥 ${request.hospital}
📍 ${request.district}

Patient Details:
👤 Name: ${request.patientName}
🩸 Blood Type: ${request.bloodType}
⚡ Units Needed: ${request.unitsNeeded}
🔔 Urgency: ${request.urgencyLevel}

📝 Additional Info:
${request.description}

📞 Contact Details:
${request.contactNumber}

⏰ Posted: ${new Date(request.createdAt).toLocaleString()}

#BloodDonation #SaveLives #${request.district}`;

    const shareData: ShareData = {
        title: '🚨 Emergency Blood Need',
        text: shareText,
    };

    if (request.imagePath) {
        shareData.url = `http://localhost:8080${request.imagePath}`;
    }

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                Swal.fire({
                    title: 'Shared!',
                    text: 'Emergency request has been shared successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch((error) => {
                console.log('Error sharing:', error);
                this.copyToClipboard(shareText);
            });
    } else {
        this.copyToClipboard(shareText);
    }
  }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            title: 'Copied! 📋',
            text: 'Emergency request details copied to clipboard. You can now paste and share it!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#fff',
            iconColor: '#e74c3c',
            customClass: {
                popup: 'animated fadeInDown'
            }
        });
    }).catch(() => {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to copy to clipboard',
            icon: 'error',
            confirmButtonColor: '#e74c3c'
        });
    });
  }

  private showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
