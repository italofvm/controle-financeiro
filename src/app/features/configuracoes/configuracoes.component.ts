import { Component, OnInit } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { finalize } from 'rxjs';
import { ConfiguracaoService } from '../../core/services/configuracao.service';
import { ExportacaoService } from '../../core/services/exportacao.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { TemaAplicacao, TemaService } from '../../core/services/tema.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

type OpcaoTema = {
  valor: TemaAplicacao;
  titulo: string;
  descricao: string;
  icone: string;
};

@Component({
  selector: 'app-configuracoes',
  imports: [LucideDynamicIcon, ModalComponent],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss'
})
export class ConfiguracoesComponent implements OnInit {

  opcoesTema: OpcaoTema[] = [
    {
      valor: 'claro',
      titulo: 'Claro',
      descricao: 'Interface clara',
      icone: 'sun'
    },
    {
      valor: 'escuro',
      titulo: 'Escuro',
      descricao: 'Interface escura',
      icone: 'moon'
    },
    {
      valor: 'sistema',
      titulo: 'Sistema',
      descricao: 'Usa o dispositivo',
      icone: 'monitor'
    }
  ];

  temaSelecionado: TemaAplicacao = 'sistema';
  isExportandoDados = false;
  isLimpandoDados = false;
  isConfirmacaoLimpezaAberta = false;

  constructor(
    private temaService: TemaService,
    private exportacaoService: ExportacaoService,
    private configuracaoService: ConfiguracaoService,
    private notificacaoService: NotificacaoService
  ) { }

  ngOnInit(): void {
    this.temaSelecionado = this.temaService.obterTemaAtual();
  }

  selecionarTema(tema: TemaAplicacao): void {
    this.temaSelecionado = tema;
    this.temaService.selecionarTema(tema);
  }

  exportarDados(): void {
    if (this.isExportandoDados) {
      return;
    }

    this.isExportandoDados = true;

    this.exportacaoService.exportarDados()
      .pipe(finalize(() => this.isExportandoDados = false))
      .subscribe({
        next: () => this.notificacaoService.mostrarMensagem('Dados exportados com sucesso.'),
        error: () => this.notificacaoService.mostrarErro('Não foi possível exportar os dados.')
      });
  }

  abrirConfirmacaoLimpeza(): void {
    this.isConfirmacaoLimpezaAberta = true;
  }

  fecharConfirmacaoLimpeza(): void {
    this.isConfirmacaoLimpezaAberta = false;
  }

  confirmarLimpezaDados(): void {
    if (this.isLimpandoDados) {
      return;
    }

    this.isConfirmacaoLimpezaAberta = false;
    this.isLimpandoDados = true;

    this.configuracaoService.limparTodosOsDados()
      .pipe(finalize(() => this.isLimpandoDados = false))
      .subscribe({
        next: () => this.notificacaoService.mostrarMensagem('Dados removidos com sucesso.'),
        error: () => this.notificacaoService.mostrarErro('Não foi possível limpar os dados.')
      });
  }

}
