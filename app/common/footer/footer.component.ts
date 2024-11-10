import { Component, OnInit, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  showFooter = false; // Set initial value to false
  isMobileKeyboardOpen = false;
  private excludedRoutes = ['/login', '/donor-form', '/signin', '/donor-registration'];
  
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    // Check route immediately in constructor
    this.checkRoute();
    
    // Subscribe to future navigation events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  }

  ngOnInit() {
    // Check route again on init
    this.checkRoute();
    
    if (this.isMobileDevice()) {
      this.onResize(null);
    }
  }

  private checkRoute() {
    const currentUrl = this.router.url;
    // Check if current route should show footer
    this.showFooter = !this.excludedRoutes.some(route => currentUrl.includes(route));
    
    // Immediately apply display style
    const footer = this.el.nativeElement.querySelector('.footer');
    if (footer) {
      this.renderer.setStyle(footer, 'display', this.showFooter ? 'block' : 'none');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const windowHeight = window.innerHeight;
    const screenHeight = window.screen.height;
    this.isMobileKeyboardOpen = windowHeight < screenHeight * 0.75;
    
    const footer = this.el.nativeElement.querySelector('.footer');
    if (footer) {
      if (this.isMobileKeyboardOpen || !this.showFooter) {
        this.renderer.setStyle(footer, 'display', 'none');
      } else {
        this.renderer.setStyle(footer, 'display', 'block');
      }
    }
  }

  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}