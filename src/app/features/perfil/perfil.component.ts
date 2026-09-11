import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule, LucideDynamicIcon, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  usuarioLogado!: Usuario;
  novoNome: string = '';
  novoEmail: string = '';
  novaSenha: string = '';
  senhaAtual: string = '';
  confirmarSenha: string = '';
  salvandoDados: boolean = false;
  alterandoSenha: boolean = false;
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  private readonly destroyRef = inject(DestroyRef);


  constructor(private authService: AuthService,
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.obterUsuario();

    if (usuario) {
      this.usuarioLogado = usuario;
      this.novoNome = usuario.nome;
      this.novoEmail = usuario.email;
    }

    this.notificacaoService.mensagem$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(mensagem => {
        this.mensagemSucesso = mensagem;
      });
    this.notificacaoService.erro$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(mensagem => {
        this.mensagemErro = mensagem;
      });
  }

  // Método para alterar os dados do usuário
  alterarDadosDoUsuario() {
    if (!this.usuarioLogado.id) return;
    if (!this.novoNome.trim() || !this.novoEmail.trim()) {
      this.notificacaoService.mostrarMensagem('Os dados não podem estar vazios');
      return;
    }

    this.salvandoDados = true;

    this.usuarioService.atualizarParcial(this.usuarioLogado.id, { nome: this.novoNome, email: this.novoEmail }).subscribe({
      next: (usuarioAtualizado) => {
        this.usuarioLogado = usuarioAtualizado;
        this.authService.salvarSessao(usuarioAtualizado);

        this.salvandoDados = false;
        this.notificacaoService.mostrarMensagem('Nome atualizado com sucesso');
      },
      error: (erro) => {
        this.salvandoDados = false;
        this.notificacaoService.mostrarErro('Ocorreu um erro ao atualizar os dados do usuário');
      }
    });
  }

  // Método para alterar a senha do usuário
  alterarSenha() {
    if (!this.usuarioLogado.id) return;

    // Verifica se todos os campos de senha foram preenchidos
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.notificacaoService.mostrarErro('Todos os campos de senha devem ser preenchidos');
      return;
    }

    // Verifica se a nova senha e a confirmação coincidem
    if (this.senhaAtual !== this.usuarioLogado.senha) {
      this.notificacaoService.mostrarErro('A senha atual está incorreta');
      return;
    }

    // Verifica se a nova senha e a confirmação coincidem
    if (this.novaSenha !== this.confirmarSenha) {
      this.notificacaoService.mostrarErro('A nova senha e a confirmação não coincidem');
      return;
    }

    // Atualiza a senha do usuário
    this.usuarioService.atualizarParcial(this.usuarioLogado.id, { senha: this.novaSenha }).subscribe({
      next: (usuarioAtualizado) => {
        this.usuarioLogado = usuarioAtualizado;
        this.authService.salvarSessao(usuarioAtualizado);

        // Limpa os campos de senha após a atualização
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';

        this.notificacaoService.mostrarMensagem('Senha atualizada com sucesso');
      },
      error: (erro) => {
        this.notificacaoService.mostrarErro('Ocorreu um erro ao atualizar a senha');
      }
    });
  }

}
