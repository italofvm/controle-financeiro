import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  atualizarParcial(id: string | number, dados: { nome?: string; senha?: string; email?: string }): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, dados);
  }
}
