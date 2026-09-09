import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { FinanceiroService } from '../../core/services/financeiro.service';
import { Categoria } from '../../models/categoria';
import { Movimentacao } from '../../models/movimentacao';
import { CardResumoComponent } from '../../shared/components/card-resumo/card-resumo.component';

interface ResumoCategoria {
  categoria: Categoria;
  total: number;
  percentual: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, LucideDynamicIcon, CardResumoComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  movimentacoes: Movimentacao[] = [];
  categorias: Categoria[] = [];
  mesSelecionado: string = new Date().toISOString().slice(0, 7);
  carregando = true;
  mensagemErro = '';
  usuarioNome: string | undefined;



  constructor(
    private financeiroService: FinanceiroService,
    private categoriaService: CategoriaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.usuarioNome = this.authService.obterUsuario()?.nome;
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    forkJoin({
      movimentacoes: this.financeiroService.getMovimentacoes(),
      categorias: this.categoriaService.getCategorias()
    }).subscribe({
      next: ({ movimentacoes, categorias }) => {
        this.movimentacoes = movimentacoes;
        this.categorias = categorias;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar os dados da dashboard.';
        this.carregando = false;
      }
    });
  }

  get movimentacoesDoMes(): Movimentacao[] {
    return this.movimentacoes.filter(movimentacao => movimentacao.data.startsWith(this.mesSelecionado));
  }

  get receitas(): number {
    return this.somarPorTipo('receita');
  }

  get despesas(): number {
    return this.somarPorTipo('despesa');
  }

  get saldo(): number {
    return this.receitas - this.despesas;
  }

  get ultimasMovimentacoes(): Movimentacao[] {
    return [...this.movimentacoesDoMes]
      .sort((atual, proxima) => proxima.data.localeCompare(atual.data))
      .slice(0, 4);
  }

  get resumoPorCategoria(): ResumoCategoria[] {
    const totais = new Map<string, number>();

    this.movimentacoesDoMes
      .filter(movimentacao => movimentacao.tipo === 'despesa')
      .forEach(movimentacao => {
        const totalAtual = totais.get(movimentacao.categoria) ?? 0;
        totais.set(movimentacao.categoria, totalAtual + movimentacao.valor);
      });

    const maiorTotal = Math.max(...totais.values(), 0);

    return [...totais.entries()]
      .map(([slug, total]) => ({
        categoria: this.buscarCategoria(slug),
        total,
        percentual: maiorTotal ? (total / maiorTotal) * 100 : 0
      }))
      .sort((atual, proxima) => proxima.total - atual.total)
      .slice(0, 4);
  }

  get mesSelecionadoFormatado(): string {
    const [ano, mes] = this.mesSelecionado.split('-').map(Number);
    const data = new Date(ano, mes - 1);
    const mesFormatado = new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(data);

    return mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1);
  }

  alterarMes(delta: number): void {
    const [ano, mes] = this.mesSelecionado.split('-').map(Number);
    const data = new Date(ano, mes - 1 + delta);
    const novoAno = data.getFullYear();
    const novoMes = String(data.getMonth() + 1).padStart(2, '0');

    this.mesSelecionado = `${novoAno}-${novoMes}`;
  }

  buscarCategoria(slug: string): Categoria {
    return this.categorias.find(categoria => categoria.slug === slug) ?? {
      id: slug,
      nome: slug,
      slug,
      icone: 'ellipsis',
      cor: 'gray'
    };
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  private somarPorTipo(tipo: Movimentacao['tipo']): number {
    return this.movimentacoesDoMes
      .filter(movimentacao => movimentacao.tipo === tipo)
      .reduce((total, movimentacao) => total + movimentacao.valor, 0);
  }
}
