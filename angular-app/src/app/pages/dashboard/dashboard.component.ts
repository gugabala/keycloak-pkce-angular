import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { EmployeeService, Employee } from '../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h1>Dashboard</h1>
      <p>Página protegida — você está autenticado!</p>
      <p><strong>Usuário:</strong> {{ username }}</p>
      <p><strong>Email:</strong> {{ email }}</p>

      <hr>

      <h2>Buscar Employee</h2>
      <input type="number" [(ngModel)]="employeeId" placeholder="ID do employee" />
      <button (click)="buscarEmployee()">Buscar</button>

      @if (employee) {
        <div>
          <h3>Employee encontrado</h3>
          <p><strong>Nome:</strong> {{ employee.name }}</p>
          <p><strong>Email:</strong> {{ employee.contactInfo?.email }}</p>
          <p><strong>Manager:</strong> {{ employee.manager?.name ?? 'Nenhum' }}</p>
        </div>
      }

      @if (erro) {
        <p style="color: red">{{ erro }}</p>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  username = '';
  email = '';
  employeeId = 1;
  employee: Employee | null = null;
  erro = '';

  constructor(
    private oauthService: OAuthService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.username = (claims as any)['preferred_username'];
      this.email = (claims as any)['email'];
    }
  }

  buscarEmployee(): void {
    this.erro = '';
    this.employee = null;
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (emp) => (this.employee = emp),
      error: () => (this.erro = 'Employee não encontrado ou sem permissão'),
    });
  }
}