import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
  }

  // Método para alterar os dados do usuário
  alterarDadosDoUsuario() {
    if (!this.usuarioLogado.id) return;
    if (!this.novoNome.trim() || !this.novoEmail.trim()) {
      this.notificacaoService.mostrarMensagem('Os dados não podem estar vazios');
      return;
    }

    this.salvandoDados = true;

    this.usuarioService.atualizarPerfil({ nome: this.novoNome.trim(), email: this.novoEmail.trim() }).subscribe({
      next: (usuarioAtualizado) => {
        this.usuarioLogado = usuarioAtualizado;
        this.authService.atualizarUsuario(usuarioAtualizado);

        this.salvandoDados = false;
        this.notificacaoService.mostrarMensagem('Dados atualizados com sucesso');
      },
      error: (erro) => {
        this.salvandoDados = false;
        this.notificacaoService.mostrarErro('Ocorreu um erro ao atualizar os dados do usuário');
      }
    });
  }

  // Método para alterar a senha do usuário
  alterarSenha() {

    // Verifica se todos os campos de senha foram preenchidos
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.notificacaoService.mostrarErro('Todos os campos de senha devem ser preenchidos');
      return;
    }

    // Verifica se a nova senha e a confirmação coincidem
    if (this.novaSenha !== this.confirmarSenha) {
      this.notificacaoService.mostrarErro('A nova senha e a confirmação não coincidem');
      return;
    }

    this.alterandoSenha = true;

    // Atualiza a senha do usuário
    this.usuarioService.alterarSenha({ senhaAtual: this.senhaAtual, novaSenha: this.novaSenha }).subscribe({
      next: () => {
        // Limpa os campos de senha após a atualização
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';

        this.alterandoSenha = false;
        this.notificacaoService.mostrarMensagem('Senha atualizada com sucesso');
      },
      error: (erro) => {
        this.alterandoSenha = false;

        this.notificacaoService.mostrarErro(erro.status === 401 ? 'A senha atual incorreta' : 'Ocorreu um erro ao atualizar a senha');
      }
    });
  }

}
