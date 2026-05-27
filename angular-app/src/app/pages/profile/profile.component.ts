import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div>
      <h1>Profile</h1>
      <p>Página protegida — dados completos do usuário.</p>
      <table>
        <tr>
          <td><strong>Nome:</strong></td>
          <td>{{ name }}</td>
        </tr>
        <tr>
          <td><strong>Usuário:</strong></td>
          <td>{{ username }}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>{{ email }}</td>
        </tr>
        <tr>
          <td><strong>Token expira em:</strong></td>
          <td>{{ tokenExpiry }}</td>
        </tr>
      </table>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  name = '';
  username = '';
  email = '';
  tokenExpiry = '';

  constructor(private oauthService: OAuthService) {}

  ngOnInit(): void {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.name = (claims as any)['name'];
      this.username = (claims as any)['preferred_username'];
      this.email = (claims as any)['email'];
      const exp = (claims as any)['exp'];
      this.tokenExpiry = new Date(exp * 1000).toLocaleString('pt-BR');
    }
  }
}