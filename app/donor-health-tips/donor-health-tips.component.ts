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
      description: 'Essential guidelines for maintaining optimal donor health'
    },
    {
      icon: 'fas fa-apple-alt',
      title: 'Nutrition',
      description: 'Balanced diet recommendations for blood donors'
    },
    {
      icon: 'fas fa-running',
      title: 'Exercise',
      description: 'Safe physical activities before and after donation'
    },
    {
      icon: 'fas fa-clock',
      title: 'Recovery',
      description: 'Post-donation care and recovery tips'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Safety',
      description: 'Important safety guidelines for donors'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Scheduling',
      description: 'Optimal timing for blood donations'
    }
  ];

  quickTips = [
    {
      icon: 'fas fa-clock',
      title: 'Best Time',
      description: 'Morning donations are recommended'
    },
    {
      icon: 'fas fa-ban',
      title: 'Restrictions',
      description: 'No alcohol 24 hours before and after'
    },
    {
      icon: 'fas fa-heart',
      title: 'Health Check',
      description: 'Regular hemoglobin monitoring'
    },
    {
      icon: 'fas fa-tint',
      title: 'Hydration',
      description: 'Drink extra fluids before donation'
    },
    {
      icon: 'fas fa-bed',
      title: 'Rest',
      description: 'Get 8 hours sleep before donating'
    }
  ];

  nutritionTips = [
    {
      icon: 'fas fa-drumstick-bite',
      title: 'Protein Rich',
      image: 'assets/images/protein.jpg',
      foods: ['Lean meat', 'Fish', 'Eggs', 'Legumes']
    },
    {
      icon: 'fas fa-leaf',
      title: 'Iron Rich',
      image: 'assets/images/iron.jpg',
      foods: ['Spinach', 'Kale', 'Red meat', 'Beans']
    },
    {
      icon: 'fas fa-lemon',
      title: 'Vitamin C',
      image: 'assets/images/vitamin-c.jpg',
      foods: ['Citrus fruits', 'Berries', 'Bell peppers']
    }
  ];
}
