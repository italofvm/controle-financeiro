import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { finalize, forkJoin } from 'rxjs';
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
  excluindo = false;
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
      movimentacoes: this.financeiroService.getMovimentacoes(1, 100)
    }).pipe(
      finalize(() => {
        this.carregando = false;
      })
    )
      .subscribe({
        next: ({ categorias, movimentacoes }) => {
          this.categorias = categorias;
          this.movimentacoes = movimentacoes.dados;
        },
        error: () => {
          this.mensagemErro = 'Não foi possível carregar as categorias.';
          this.notificacaoService.mostrarErro(this.mensagemErro);
        }
      });
  }

  quantidadeMovimentacoes(categoriaId: string): number {
    return this.movimentacoes.filter(movimentacao => movimentacao.categoriaId === categoriaId).length;
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

    this.excluindo = true;
    this.categoriaService.deletar(this.categoriaSelecionada.id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(item => item.id !== this.categoriaSelecionada?.id);
        this.notificacaoService.mostrarMensagem('Categoria excluída com sucesso!');
        this.fecharModal();
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível excluir a categoria.')
    });
  }

}
