import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    senha: new FormControl('', [
      Validators.required
    ])

  })

  mensagemErro = '';

  constructor(private authService: AuthService, private router: Router) { }

  entrar(): void {

    console.log('Formulário:', this.loginForm.value);
    console.log('Válido:', this.loginForm.valid);
    console.log('Erros:', this.loginForm.errors);

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email!;
    const senha = this.loginForm.value.senha!;

    this.authService.login(email, senha).subscribe({
      next: usuario => {
        if (!usuario) {
          this.mensagemErro = 'E-mail ou senha inválidos.'
          return;
        }
        this.authService.salvarSessao(usuario);
        this.router.navigate(['/dashboard']);
      },

      error: erro => {
        console.error('Erro no login:', erro);
        this.mensagemErro = 'Não foi possível realizar o login.'
      }
    })
  }
}
