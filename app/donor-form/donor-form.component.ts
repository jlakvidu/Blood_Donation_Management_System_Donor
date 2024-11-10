import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-donor-form',
  templateUrl: './donor-form.component.html',
  styleUrls: ['./donor-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class DonorFormComponent {
  donorForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.donorForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      age: new FormControl(null),
      bloodType: new FormControl('', [Validators.required]),
      contactNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      profileImage: new FormControl(null)
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  calculateAge(): void {
    const dobValue = this.donorForm.get('dob')?.value;
    if (dobValue) {
      const dob = new Date(dobValue);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
      }
      this.donorForm.patchValue({ age });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.donorForm.valid) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      Object.keys(this.donorForm.value).forEach(key => {
        if (key !== 'profileImage') {
          formData.append(key, this.donorForm.value[key]);
        }
      });
      
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      this.http.post("http://localhost:8080/donor/add-donor", formData)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.router.navigate(['/donor-dashboard']);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error("Error adding donor:", error);
            alert("Error adding donor. Please try again.");
          }
        });
    } else {
      alert("Please fill in all required fields.");
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset 
      || document.documentElement.scrollTop 
      || document.body.scrollTop 
      || 0;
    const threshold = 100;

    if (scrollPosition > threshold) {
      this.renderer.addClass(this.el.nativeElement, 'scrolled');
      const formSection = this.el.nativeElement.querySelector('.form-section');
      const container = this.el.nativeElement.querySelector('.registration-container');
      const imageSection = this.el.nativeElement.querySelector('.image-section');
      
      if (formSection) this.renderer.addClass(formSection, 'scrolled');
      if (container) this.renderer.addClass(container, 'scrolled');
      if (imageSection) this.renderer.addClass(imageSection, 'scrolled');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'scrolled');
      const formSection = this.el.nativeElement.querySelector('.form-section');
      const container = this.el.nativeElement.querySelector('.registration-container');
      const imageSection = this.el.nativeElement.querySelector('.image-section');
      
      if (formSection) this.renderer.removeClass(formSection, 'scrolled');
      if (container) this.renderer.removeClass(container, 'scrolled');
      if (imageSection) this.renderer.removeClass(imageSection, 'scrolled');
    }
  }
}
