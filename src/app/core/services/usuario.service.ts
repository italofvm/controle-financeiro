import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarUsuario } from '../../models/dtos/criar-usuario.dto';
import { Usuario } from '../../models/usuario';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  criarUsuario(dados: CriarUsuario): Observable<Usuario> {
    console.log('CRIAR USUARIO NOVO', dados);
    console.log('URL:', `${this.apiUrl}/usuarios`);
    return this.http.post<Usuario>(`${this.apiUrl}`, dados);
  }

  obterPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(
      `${this.apiUrl}/me`
    );
  }

  atualizarPerfil(dados: { nome?: string; email?: string }): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/me`, dados);
  }

  alterarSenha(dados: { senhaAtual: string; novaSenha: string }): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/me/senha`,
      dados
    )
  }
}
