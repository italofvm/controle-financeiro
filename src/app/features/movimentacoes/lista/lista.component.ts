import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from "@lucide/angular";
import { CategoriaService } from '../../../core/services/categoria.service';
import { FinanceiroService } from '../../../core/services/financeiro.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Categoria } from '../../../models/categoria';
import { Movimentacao } from '../../../models/movimentacao';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-lista',
  imports: [LucideDynamicIcon, FormsModule, CommonModule, ModalComponent, RouterLink],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements OnInit {

  movimentacoes: Movimentacao[] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 6;
  categorias: Categoria[] = [];

  termoPesquisa: string = '';
  tipoSelecionado: string = '';
  categoriaSelecionada: string = '';
  selectedMonth: string = new Date().toISOString().slice(0, 7); // Formato YYYY-MM

  isModalOpen: boolean = false;
  movimentacaoSelecionada: Movimentacao | null = null;
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  private readonly destroyRef = inject(DestroyRef);

  constructor(private financeiroService: FinanceiroService,
    private notificacaoService: NotificacaoService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.carregarCategorias();
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
    this.financeiroService.getMovimentacoes().subscribe({
      next: dados => {
        this.movimentacoes = [...dados].reverse();
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível carregar as movimentações.')
    });
  }

  get movimentacoesFiltradas(): Movimentacao[] {
    return this.movimentacoes.filter(movimentacao => {
      const pesquisa = this.termoPesquisa.toLowerCase().trim();

      const correspondePesquisa = !pesquisa || movimentacao.descricao.toLowerCase().includes(pesquisa);

      const correspondeTipo = !this.tipoSelecionado || movimentacao.tipo === this.tipoSelecionado;

      const correspondeCategoria = !this.categoriaSelecionada || movimentacao.categoria === this.categoriaSelecionada;

      const correspondeMes = !this.selectedMonth || movimentacao.data?.startsWith(this.selectedMonth);

      return (
        correspondePesquisa &&
        correspondeTipo &&
        correspondeCategoria &&
        correspondeMes
      );
    });
  }

  // Sistema de paginação
  get totalPaginas(): number {
    return Math.ceil(this.movimentacoesFiltradas.length / this.itensPorPagina);
  }

  get movimentacoesPaginadas(): Movimentacao[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return this.movimentacoesFiltradas.slice(inicio, fim);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  // Função para deletar uma movimentação

  abrirModal(movimentacao: Movimentacao) {
    this.movimentacaoSelecionada = movimentacao;
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
    this.movimentacaoSelecionada = null;
  }


  confirmarExclusao() {
    if (!this.movimentacaoSelecionada) {
      return;
    }
    this.financeiroService.deletar(this.movimentacaoSelecionada).subscribe({
      next: () => {
        this.movimentacoes = this.movimentacoes.filter(m => m.id !== this.movimentacaoSelecionada!.id);
        this.notificacaoService.mostrarMensagem('Movimentação deletada com sucesso!');
        this.fecharModal();
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível excluir a movimentação.')
    });
  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: categorias => {
        this.categorias = categorias;
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível carregar as categorias.')
    })
  }
}
