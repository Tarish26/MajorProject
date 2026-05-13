import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/dashboard.models';
import { Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, User as FirebaseUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  private readonly currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  readonly user$: Observable<User | null | undefined> = this.currentUserSubject.asObservable();

  constructor() {
    user(this.auth).subscribe((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        this.currentUserSubject.next({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
          role: 'Admin' // Default role for now
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  getCurrentUser(): Observable<User | null | undefined> {
    return this.user$;
  }

  async updateUser(user: Partial<User>): Promise<void> {
    // In a real app, you would use Firebase updateProfile here:
    // await updateProfile(this.auth.currentUser!, { displayName: user.name });
    // For now, we update the local behavior subject so the UI updates
    const current = this.currentUserSubject.value;
    if (current) {
      this.currentUserSubject.next({ ...current, ...user });
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
