import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { CategoriaService } from './categoria.service';
import { FinanceiroService } from './financeiro.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  constructor(
    private financeiroService: FinanceiroService,
    private categoriaService: CategoriaService
  ) { }

  limparTodosOsDados(): Observable<void> {
    return forkJoin({
      movimentacoes: this.financeiroService.getMovimentacoes(),
      categorias: this.categoriaService.getCategorias()
    }).pipe(
      switchMap(({ movimentacoes, categorias }) => {
        const exclusoes = [
          ...movimentacoes.map(movimentacao => this.financeiroService.deletar(movimentacao)),
          ...categorias.map(categoria => this.categoriaService.deletar(categoria))
        ];

        if (!exclusoes.length) {
          return of(void 0);
        }

        return forkJoin(exclusoes).pipe(map(() => void 0));
      })
    );
  }
}
