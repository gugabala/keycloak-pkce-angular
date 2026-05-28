import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './core/auth/auth.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/dashboard">Dashboard</a>
      <a routerLink="/profile">Profile</a>
      @if (!isLoggedIn) {
        <button (click)="login()">Login</button>
      }
      @if (isLoggedIn) {
        <button (click)="logout()">Logout</button>
      }
    </nav>
    <router-outlet />
  `,
})
export class App implements OnInit {
  isLoggedIn = false;

  constructor(private oauthService: OAuthService) { }

  ngOnInit(): void {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.isLoggedIn = this.oauthService.hasValidAccessToken();
    });

    this.oauthService.events.subscribe(() => {
      this.isLoggedIn = this.oauthService.hasValidAccessToken();
    });
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
    this.isLoggedIn = false;
  }
}