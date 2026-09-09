import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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

  atualizar(movimentacao: Movimentacao): Observable<Movimentacao> {
    return this.http.put<Movimentacao>(`${this.apiUrl}/movimentacoes/${movimentacao.id}`, movimentacao);
  }

  salvar(movimentacao: Omit<Movimentacao, 'id'>): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(`${this.apiUrl}/movimentacoes`, movimentacao);
  }

  deletar(movimentacao: Movimentacao): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movimentacoes/${movimentacao.id}`);
  }
}
