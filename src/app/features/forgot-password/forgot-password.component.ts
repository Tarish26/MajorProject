import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: '../login/login.component.scss' // Reusing login styles
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  async onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);
      
      try {
        await this.authService.resetPassword(this.resetForm.value.email!);
        this.successMessage.set('Password reset email sent! Please check your inbox.');
      } catch (error: any) {
        this.errorMessage.set(error.message || 'Failed to send reset email. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
