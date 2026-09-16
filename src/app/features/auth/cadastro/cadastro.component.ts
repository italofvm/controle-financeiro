import { Component } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CriarUsuario } from '../../../models/dtos/criar-usuario.dto';
import UsuarioFormControls from './usuario-form-controls.type';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink, LucideDynamicIcon],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  camposFormulario: FormGroup<UsuarioFormControls>;

  constructor(private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private router: Router,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.camposFormulario = this.formBuilder.group<UsuarioFormControls>({
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      confirmarSenha: this.formBuilder.control('', Validators.required),

    },
      { validators: this.senhasCoincidem }

    );
  }

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alternarVisibilidadeConfirmarSenha(): void {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  cadastrarUsuario(): void {
    if (this.camposFormulario.invalid) {
      this.camposFormulario.markAllAsTouched();
      return;
    }

    const usuario = this.criarUsuarioDoFormulario();

    this.usuarioService.criarUsuario(usuario).subscribe({
      next: () => {
        this.notificacaoService.mostrarMensagem('Usuário cadastrado com sucesso!');

        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.notificacaoService.mostrarErro('O email já está em uso.');
          return;
        }
        this.notificacaoService.mostrarErro('Não foi possível cadastrar o usuário.');
      }
    });
  }

  private criarUsuarioDoFormulario(): CriarUsuario {
    const valores = this.camposFormulario.getRawValue();
    return {
      nome: valores.nome.trim(),
      email: valores.email.trim().toLocaleLowerCase('pt-BR'),
      senha: valores.senha
    };
  }

  senhasCoincidem(grupo: AbstractControl): ValidationErrors | null {
    const senha = grupo.get('senha')?.value;
    const confirmarSenha = grupo.get('confirmarSenha')?.value;

    if (senha !== confirmarSenha) {
      return { senhasDiferentes: true };
    }

    return null;

  }
}
