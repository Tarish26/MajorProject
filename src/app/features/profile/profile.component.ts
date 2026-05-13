import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  readonly user$: Observable<any>;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['']
    });
  }

  ngOnInit(): void {
    const userSub = this.user$.pipe(
      filter(user => user !== undefined && user !== null),
      take(1)
    ).subscribe(user => {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role
      });
    });
    this.subscriptions.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.authService.updateUser(this.profileForm.value);
      console.log('Profile updated:', this.profileForm.value);
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
