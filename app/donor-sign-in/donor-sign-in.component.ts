import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface LoginRequest {
  emailAddress: string;
  password: string;
  profileImage?: string;
}

interface ResetPasswordState {
  step: 'email' | 'otp' | 'newPassword';
  email: string;
  otp: string;
}

@Component({
  selector: 'app-donor-sign-in',
  templateUrl: './donor-sign-in.component.html',
  styleUrls: ['./donor-sign-in.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule]
})
export class DonorSignInComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;
  showResetModal = false;
  resetState: ResetPasswordState = {
    step: 'email',
    email: '',
    otp: ''
  };
  newPassword = '';
  confirmNewPassword = '';
  showForgotPassword = false;
  showOTPInput = false;
  showNewPassword = false;
  resetEmail = '';
  otp = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
      profileImage: [null]  
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/donor-dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        emailAddress: this.loginForm.get('emailAddress')?.value.trim(),
        password: this.loginForm.get('password')?.value,
      };

      if (this.selectedImage) {
        const reader = new FileReader();
        reader.onload = () => {
          loginRequest.profileImage = reader.result as string;  
          this.sendLoginRequest(loginRequest);
        };
        reader.readAsDataURL(this.selectedImage);
      } else {
        this.sendLoginRequest(loginRequest);
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  private sendLoginRequest(loginRequest: LoginRequest) {
    this.http.post('http://localhost:8080/donor/login', loginRequest, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.isLoading = false;
          console.log('Login response:', response);

          if (response === "Login successful") {
            localStorage.clear();
            sessionStorage.clear();
            
            localStorage.setItem('userEmailAddress', loginRequest.emailAddress);
            localStorage.setItem('isLoggedIn', 'true');
            
            if (loginRequest.profileImage) {
              localStorage.setItem('userProfileImage', loginRequest.profileImage);
            }

            window.dispatchEvent(new Event('donorProfileImageUpdated'));
            
            // Navigate to dashboard after successful login
            this.router.navigate(['/donor-dashboard']);
          } else {
            this.errorMessage = 'Invalid credentials';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          this.isLoading = false;
          
          if (error.status === 401) {
            this.errorMessage = error.error || 'Invalid email address or password';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = error.error || 'Login failed. Please try again.';
          }

          this.loginForm.patchValue({
            password: ''
          });
        }
      });
  }

  private loadInitialNotifications(email: string) {
    const notificationsUrl = `http://localhost:8080/notifications/user/${email}`;
    
    this.http.get(notificationsUrl).subscribe({
      next: (notifications) => {
        console.log('Initial notifications loaded:', notifications);
      },
      error: (error) => {
        console.error('Error loading initial notifications:', error);
      }
    });
  }

  openResetModal() {
    this.showResetModal = true;
    this.resetState = { step: 'email', email: '', otp: '' };
  }

  closeResetModal() {
    this.showResetModal = false;
  }

  toggleForgotPassword(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.showForgotPassword = !this.showForgotPassword;
    this.showOTPInput = false;
    this.showNewPassword = false;
    this.resetEmail = '';
    this.otp = '';
    this.newPassword = '';
  }

  requestPasswordReset() {
    if (!this.resetEmail) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter your email address',
        icon: 'error'
      });
      return;
    }

    this.isLoading = true;
    this.http.post('http://localhost:8080/donor/password/request-reset',
      { emailAddress: this.resetEmail },
      { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showOTPInput = true;
          Swal.fire({
            title: 'Success',
            text: 'OTP has been sent to your email',
            icon: 'success'
          });
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            Swal.fire({
              title: 'Error',
              text: 'Donor not found with this email',
              icon: 'error'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: error.error || 'Failed to send OTP',
              icon: 'error'
            });
          }
        }
      });
  }

  verifyOTP() {
    if (!this.otp) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter the OTP',
        icon: 'error'
      });
      return;
    }

    this.http.post('http://localhost:8080/donor/password/verify-otp',
      {
        emailAddress: this.resetEmail,
        otp: this.otp
      },
      { responseType: 'text' })
      .subscribe({
        next: () => {
          this.showNewPassword = true;
          this.showOTPInput = false;
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Invalid or expired OTP',
            icon: 'error'
          });
        }
      });
  }

  resetPassword() {
    if (!this.newPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a new password',
        icon: 'error'
      });
      return;
    }

    this.http.post('http://localhost:8080/donor/password/reset',
      {
        emailAddress: this.resetEmail,
        newPassword: this.newPassword
      },
      { responseType: 'text' })
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Success',
            text: 'Password has been reset successfully',
            icon: 'success'
          }).then(() => {
            this.toggleForgotPassword();
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to reset password',
            icon: 'error'
          });
        }
      });
  }
}
