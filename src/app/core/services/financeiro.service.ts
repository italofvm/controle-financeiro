import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtualizarMovimentacao } from '../../models/dtos/atualizar-movimentacao.dto';
import { CriarMovimentacao } from '../../models/dtos/criar-movimentacao.dto';
import { MovimentacoesPaginadas } from '../../models/dtos/paginacao.dto';
import { Movimentacao } from '../../models/movimentacao';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMovimentacoes(
    page: number,
    limit: number,
    tipo?: string,
    categoriaId?: string,
    mes?: string,
    busca?: string
  ): Observable<MovimentacoesPaginadas> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (tipo) {
      params = params.set('tipo', tipo);
    }

    if (categoriaId) {
      params = params.set('categoriaId', categoriaId);
    }

    if (mes) {
      params = params.set('mes', mes);
    }

    if (busca?.trim()) {
      params = params.set('busca', busca.trim());
    }

    return this.http
      .get<MovimentacoesPaginadas>(`${this.apiUrl}/movimentacoes`, { params })
      .pipe(
        map(response => Array.isArray(response)
          ? this.paginarMovimentacoesLocais(response, page, limit, tipo, categoriaId, mes, busca)
          : response
        )
      );
  }

  private paginarMovimentacoesLocais(
    movimentacoes: Movimentacao[],
    page: number,
    limit: number,
    tipo?: string,
    categoriaId?: string,
    mes?: string,
    busca?: string
  ): MovimentacoesPaginadas {
    const termo = busca?.trim().toLowerCase();
    const filtradas = movimentacoes.filter(movimentacao =>
      (!tipo || movimentacao.tipo === tipo) &&
      (!categoriaId || movimentacao.categoriaId === categoriaId) &&
      (!mes || movimentacao.data.startsWith(mes)) &&
      (!termo || movimentacao.descricao.toLowerCase().includes(termo))
    );
    const totalItens = filtradas.length;
    const totalPaginas = Math.ceil(totalItens / limit);
    const paginaAtual = totalPaginas ? Math.min(page, totalPaginas) : 1;
    const inicio = (paginaAtual - 1) * limit;

    return {
      dados: filtradas.slice(inicio, inicio + limit),
      paginacao: { paginaAtual, itensPorPagina: limit, totalItens, totalPaginas }
    };
  }

  getMovimentacao(id: string): Observable<Movimentacao> {
    return this.http.get<Movimentacao>(`${this.apiUrl}/movimentacoes/${id}`);
  }

  atualizar(id: string, dados: AtualizarMovimentacao): Observable<Movimentacao> {
    return this.http.patch<Movimentacao>(`${this.apiUrl}/movimentacoes/${id}`, dados);
  }

  salvar(movimentacao: CriarMovimentacao): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(`${this.apiUrl}/movimentacoes`, movimentacao);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movimentacoes/${id}`);
  }
}
