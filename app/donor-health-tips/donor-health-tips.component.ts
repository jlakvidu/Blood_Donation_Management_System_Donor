import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-donor-health-tips',
  standalone: true,
  imports: [NgFor],
  templateUrl: './donor-health-tips.component.html',
  styleUrl: './donor-health-tips.component.css'
})
export class DonorHealthTipsComponent {
  categories = [
    {
      icon: 'fas fa-heartbeat',
      title: 'General Health',
      description: 'Tips for maintaining overall health'
    },
    {
      icon: 'fas fa-apple-alt',
      title: 'Nutrition',
      description: 'Dietary guidelines for donors'
    },
    {
      icon: 'fas fa-running',
      title: 'Exercise',
      description: 'Safe physical activities'
    }
  ];

  quickTips = [
    {
      icon: 'fas fa-clock',
      title: 'Timing Matters',
      description: 'Donate blood early in the day'
    },
    {
      icon: 'fas fa-ban',
      title: 'Avoid',
      description: 'Skip alcohol for 24 hours after donation'
    },
    {
      icon: 'fas fa-heart',
      title: 'Regular Checkups',
      description: 'Monitor your hemoglobin levels'
    }
  ];
}
