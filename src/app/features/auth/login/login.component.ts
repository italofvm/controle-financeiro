import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LucideDynamicIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  mostrarSenha = false;

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

  constructor(private authService: AuthService, private router: Router, private notificacaoService: NotificacaoService) { }

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  entrar(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email!;
    const senha = this.loginForm.value.senha!;

    this.authService.login(email, senha).subscribe({
      next: loginResponse => {
        this.authService.salvarSessao(loginResponse.usuario, loginResponse.token);
        this.notificacaoService.mostrarMensagem('Login realizado com sucesso!');
        this.router.navigate(['/dashboard']);
      },

      error: erro => {
        if (erro.status === 401) {
          this.notificacaoService.mostrarErro('E-mail ou senha inválidos.');
          return;
        }
        this.notificacaoService.mostrarErro('Não foi possível realizar o login.');
      }
    })
  }
}
