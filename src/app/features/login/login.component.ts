import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import * as THREE from 'three';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threejsCanvas') canvasRef!: ElementRef<HTMLDivElement>;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  ngAfterViewInit() {
    this.initThreeJs();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThreeJs() {
    const container = this.canvasRef.nativeElement;
    const scene = new THREE.Scene();
    
    // Add Fog to blend into the background cleanly
    scene.fog = new THREE.FogExp2(0x050505, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Create Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 1000;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      color: 0x8b5cf6, // Matches --primary-color
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      // Rotate slowly over time
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Mouse parallax effect
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      this.renderer.render(scene, camera);
    };

    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      const { email, password } = this.loginForm.value;
      
      try {
        await this.authService.login(email!, password!);
      } catch (error: any) {
        this.errorMessage.set(error.message || 'Login failed. Please check your credentials.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
