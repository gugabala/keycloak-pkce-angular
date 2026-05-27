import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div>
      <h1>Dashboard</h1>
      <p>Página protegida — você está autenticado!</p>
      <p><strong>Usuário:</strong> {{ username }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  username = '';
  email = '';

  constructor(private oauthService: OAuthService) {}

  ngOnInit(): void {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.username = (claims as any)['preferred_username'];
      this.email = (claims as any)['email'];
    }
  }
}