import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtualizarMovimentacao } from '../../models/dtos/atualizar-movimentacao.dto';
import { CriarMovimentacao } from '../../models/dtos/criar-movimentacao.dto';
import { Movimentacao } from '../../models/movimentacao';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.apiUrl}/movimentacoes`);
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
