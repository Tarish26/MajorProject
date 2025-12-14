import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { User } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: undefined,
    role: 'Admin'
  });

  readonly user$: Observable<User> = this.currentUserSubject.asObservable();

  getCurrentUser(): Observable<User> {
    return of(this.currentUserSubject.value).pipe(delay(200));
  }

  updateUser(user: Partial<User>): void {
    const current = this.currentUserSubject.value;
    this.currentUserSubject.next({ ...current, ...user });
  }

  logout(): void {
    this.currentUserSubject.next({
      id: '',
      name: '',
      email: '',
      role: ''
    });
  }
}
