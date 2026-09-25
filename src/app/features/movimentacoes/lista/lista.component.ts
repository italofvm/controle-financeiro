import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { debounceTime, distinctUntilChanged, finalize, Subject, Subscription } from 'rxjs';

import { CategoriaService } from '../../../core/services/categoria.service';
import { FinanceiroService } from '../../../core/services/financeiro.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';

import { Categoria } from '../../../models/categoria';
import { Movimentacao } from '../../../models/movimentacao';

import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-lista',
  imports: [
    LucideDynamicIcon,
    FormsModule,
    CommonModule,
    ModalComponent,
    RouterLink
  ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements OnInit {

  movimentacoes: Movimentacao[] = [];
  categorias: Categoria[] = [];

  paginaAtual = 1;
  itensPorPagina = 6;
  totalPaginas = 0;
  totalItens = 0;

  termoPesquisa = '';
  tipoSelecionado = '';
  categoriaSelecionada = '';

  selectedMonth = new Date()
    .toISOString()
    .slice(0, 7);

  carregando = false;

  isModalOpen = false;
  movimentacaoSelecionada: Movimentacao | null = null;
  private buscaSubject = new Subject<string>();
  private carregamentoMovimentacoes?: Subscription;

  constructor(
    private financeiroService: FinanceiroService,
    private notificacaoService: NotificacaoService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarMovimentacoes();

    this.buscaSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.paginaAtual = 1;
        this.carregarMovimentacoes();
      })
  }

  aoPesquisar(valor: string): void {
    this.termoPesquisa = valor;
    this.buscaSubject.next(valor.trim());
  }

  carregarMovimentacoes(): void {
    this.carregamentoMovimentacoes?.unsubscribe();
    this.carregando = true;

    this.carregamentoMovimentacoes = this.financeiroService
      .getMovimentacoes(
        this.paginaAtual,
        this.itensPorPagina,
        this.tipoSelecionado || undefined,
        this.categoriaSelecionada || undefined,
        this.selectedMonth || undefined,
        this.termoPesquisa || undefined
      )
      .pipe(
        finalize(() => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: response => {
          this.movimentacoes = response.dados;

          this.paginaAtual =
            response.paginacao.paginaAtual;

          this.itensPorPagina =
            response.paginacao.itensPorPagina;

          this.totalItens =
            response.paginacao.totalItens;

          this.totalPaginas =
            response.paginacao.totalPaginas;
        },

        error: () => {
          this.notificacaoService.mostrarErro(
            'Não foi possível carregar as movimentações.'
          );
        }
      });
  }

  carregarCategorias(): void {
    this.categoriaService
      .getCategorias()
      .subscribe({
        next: categorias => {
          this.categorias = categorias;
        },

        error: () => {
          this.notificacaoService.mostrarErro(
            'Não foi possível carregar as categorias.'
          );
        }
      });
  }

  get paginas(): number[] {
    return Array.from(
      { length: this.totalPaginas },
      (_, i) => i + 1
    );
  }

  irParaPagina(pagina: number): void {
    if (
      pagina < 1 ||
      pagina > this.totalPaginas ||
      pagina === this.paginaAtual
    ) {
      return;
    }

    this.paginaAtual = pagina;
    this.carregarMovimentacoes();
  }

  proximaPagina(): void {
    if (this.paginaAtual >= this.totalPaginas) {
      return;
    }

    this.paginaAtual++;
    this.carregarMovimentacoes();
  }

  paginaAnterior(): void {
    if (this.paginaAtual <= 1) {
      return;
    }

    this.paginaAtual--;
    this.carregarMovimentacoes();
  }

  abrirModal(movimentacao: Movimentacao): void {
    this.movimentacaoSelecionada = movimentacao;
    this.isModalOpen = true;
  }

  fecharModal(): void {
    this.isModalOpen = false;
    this.movimentacaoSelecionada = null;
  }

  confirmarExclusao(): void {
    if (!this.movimentacaoSelecionada) {
      return;
    }

    const id = this.movimentacaoSelecionada.id;

    this.financeiroService
      .deletar(id)
      .subscribe({
        next: () => {
          this.notificacaoService.mostrarMensagem(
            'Movimentação deletada com sucesso!'
          );

          this.fecharModal();

          if (
            this.movimentacoes.length === 1 &&
            this.paginaAtual > 1
          ) {
            this.paginaAtual--;
          }

          this.carregarMovimentacoes();
        },

        error: () => {
          this.notificacaoService.mostrarErro(
            'Não foi possível excluir a movimentação.'
          );
        }
      });
  }

  nomeCategoria(
    categoriaId: string | null | undefined
  ): string {
    if (!categoriaId) {
      return 'Outros';
    }

    return (
      this.categorias.find(
        categoria => categoria.id === categoriaId
      )?.nome ?? 'Outros'
    );
  }

  aplicarFiltros(): void {
    this.paginaAtual = 1;
    this.carregarMovimentacoes();
  }
}
