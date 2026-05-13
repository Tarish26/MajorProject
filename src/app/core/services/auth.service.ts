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
  private wasLoggedIn = false;

  constructor() {
    user(this.auth).subscribe((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        this.wasLoggedIn = true;
        this.currentUserSubject.next({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
          role: 'Admin' // Default role for now
        });
        
        // If they become logged in (e.g. from another tab) while sitting on an auth page
        const currentUrl = this.router.url;
        if (currentUrl.includes('/login') || currentUrl.includes('/signup') || currentUrl.includes('/forgot-password')) {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.currentUserSubject.next(null);
        // If they were previously logged in and state becomes null (e.g. logout from another tab)
        if (this.wasLoggedIn) {
          this.wasLoggedIn = false;
          this.router.navigate(['/login']);
        }
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
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      if (credential.user) {
        this.currentUserSubject.next({
          id: credential.user.uid,
          name: credential.user.displayName || 'User',
          email: credential.user.email || '',
          avatar: credential.user.photoURL || undefined,
          role: 'Admin'
        });
      }
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(email: string, password: string): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (credential.user) {
        this.currentUserSubject.next({
          id: credential.user.uid,
          name: credential.user.displayName || 'User',
          email: credential.user.email || '',
          avatar: credential.user.photoURL || undefined,
          role: 'Admin'
        });
      }
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
