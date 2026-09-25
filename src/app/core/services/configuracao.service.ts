import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { FinanceiroService } from './financeiro.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  constructor(
    private financeiroService: FinanceiroService,
  ) { }

  limparTodosOsDados(): Observable<void> {
    return forkJoin({
      movimentacoes: this.financeiroService.getMovimentacoes(1, 100),
    }).pipe(
      switchMap(({ movimentacoes }) => {
        const exclusoes = movimentacoes.dados.map((movimentacao) =>
          this.financeiroService.deletar(movimentacao.id));

        if (!exclusoes.length) {
          return of(void 0);
        }

        return forkJoin(exclusoes).pipe(map(() => void 0));
      })
    );
  }
}
