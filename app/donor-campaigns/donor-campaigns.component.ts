import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donor-campaigns',
  templateUrl: './donor-campaigns.component.html',
  styleUrls: ['./donor-campaigns.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class DonorCampaignsComponent implements OnInit {
  campaigns: any[] = [];
  searchTerm: string = '';
  selectedLocation: string = '';

  constructor() {}

  ngOnInit() {
    // Load campaigns data
  }

  registerForCampaign(campaignId: number) {
    // Implement registration logic
  }

  viewCampaignDetails(campaignId: number) {
    // Implement view details logic
  }

  refreshCampaigns() {
    
  }
}
