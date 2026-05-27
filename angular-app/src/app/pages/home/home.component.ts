import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h1>Bem-vindo!</h1>
      <p>Esta é uma página pública. Nenhum login necessário.</p>
      <p>
        <a routerLink="/dashboard">Ir para o Dashboard</a> |
        <a routerLink="/profile">Ir para o Profile</a>
      </p>
    </div>
  `,
})
export class HomeComponent {}