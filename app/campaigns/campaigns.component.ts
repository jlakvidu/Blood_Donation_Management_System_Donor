import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Campaign {
  id?: number;
  title: string;
  date: string;
  venue: string;
  description: string;
  imagePath?: string;
  hospitalName: string;
  contactNumber: string;
  hospitalEmail?: string;
  district: string;
}

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.css'
})
export class CampaignsComponent implements OnInit {
  campaigns: Campaign[] = [];
  loading = false;
  searchDistrict: string = '';

  get filteredCampaigns(): Campaign[] {
    if (!this.searchDistrict) {
      return this.campaigns;
    }
    return this.campaigns.filter(campaign =>
      campaign.district.toLowerCase().includes(this.searchDistrict.toLowerCase())
    );
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.loading = true;
    this.http.get<Campaign[]>('http://localhost:8080/campaign').subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
        this.showErrorAlert('Error loading campaigns');
        this.loading = false;
      }
    });
  }

  initiateCall(contactNumber: string) {
    window.location.href = `tel:${contactNumber}`;
  }

  async shareCampaign(campaign: Campaign) {
    const shareText = `🏥 BLOOD DONATION CAMPAIGN 🩸

🏥 ${campaign.hospitalName}
📍 ${campaign.venue}

📅 Date: ${new Date(campaign.date).toLocaleDateString()}

📝 Campaign Details:
${campaign.description}

📞 Contact Details:
${campaign.contactNumber}
${campaign.hospitalEmail ? `📧 ${campaign.hospitalEmail}` : ''}

#BloodDonation #SaveLives`;

    const shareData: ShareData = {
      title: 'Blood Donation Campaign',
      text: shareText
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        this.showShareSuccess();
      } else {
        this.copyToClipboard(shareText);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      this.copyToClipboard(shareText);
    }
  }

  private showShareSuccess() {
    Swal.fire({
      title: 'Shared Successfully! 🎉',
      text: 'Campaign details have been shared',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: '#fff',
      iconColor: '#e74c3c',
      customClass: {
        popup: 'animated fadeInDown'
      }
    });
  }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        title: 'Copied to Clipboard! 📋',
        html: 'Campaign details copied.<br>You can now paste and share it!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff',
        iconColor: '#e74c3c',
        customClass: {
          popup: 'animated fadeInDown',
          title: 'share-title',
          htmlContainer: 'share-text'
        }
      });
    }).catch(() => {
      this.showErrorAlert('Failed to copy to clipboard');
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
