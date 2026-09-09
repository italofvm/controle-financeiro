import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&senha=${senha}`)
      .pipe(
        map(usuarios => usuarios.length > 0 ? usuarios[0] : null)
      );
  }

  salvarSessao(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
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
  }

}
