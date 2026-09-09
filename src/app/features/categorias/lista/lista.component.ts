import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { forkJoin } from 'rxjs';
import { CategoriaService } from '../../../core/services/categoria.service';
import { FinanceiroService } from '../../../core/services/financeiro.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Categoria } from '../../../models/categoria';
import { Movimentacao } from '../../../models/movimentacao';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, LucideDynamicIcon, ModalComponent, RouterLink],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements OnInit {
  categorias: Categoria[] = [];
  movimentacoes: Movimentacao[] = [];
  categoriaSelecionada: Categoria | null = null;
  isModalOpen = false;
  carregando = true;
  mensagemErro = '';

  constructor(
    private categoriaService: CategoriaService,
    private financeiroService: FinanceiroService,
    private notificacaoService: NotificacaoService
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    forkJoin({
      categorias: this.categoriaService.getCategorias(),
      movimentacoes: this.financeiroService.getMovimentacoes()
    }).subscribe({
      next: ({ categorias, movimentacoes }) => {
        this.categorias = categorias;
        this.movimentacoes = movimentacoes;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as categorias.';
        this.notificacaoService.mostrarErro(this.mensagemErro);
      }
    });
  }

  quantidadeMovimentacoes(categoria: Categoria): number {
    return this.movimentacoes.filter(item => item.categoria === categoria.slug).length;
  }

  abrirModal(categoria: Categoria, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.categoriaSelecionada = categoria;
    this.isModalOpen = true;
  }

  fecharModal(): void {
    this.categoriaSelecionada = null;
    this.isModalOpen = false;
  }

  confirmarExclusao(): void {
    if (!this.categoriaSelecionada) {
      return;
    }

    this.categoriaService.deletar(this.categoriaSelecionada).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(item => item.id !== this.categoriaSelecionada?.id);
        this.notificacaoService.mostrarMensagem('Categoria excluída com sucesso!');
        this.fecharModal();
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível excluir a categoria.')
    });
  }

}
