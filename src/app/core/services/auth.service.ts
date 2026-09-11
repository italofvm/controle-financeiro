import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/usuarios`;
  
  private usuarioSubject =
    new BehaviorSubject<Usuario | null>(null);

  usuario$ =
    this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const usuario = this.obterUsuario();
    this.usuarioSubject.next(usuario);
  }

  login(email: string, senha: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${encodeURIComponent(email)}`)
      .pipe(
        map(usuarios => usuarios.find(u => u.senha === senha) ?? null)
      );
  }

  salvarSessao(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  obterUsuario(): Usuario | null {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
      return null;
    }

    return JSON.parse(usuario);
  }

  estaAutenticado(): boolean {
    return !!this.obterUsuario();
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

}
