import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  private mensagem = new BehaviorSubject<string>('');
  private erro = new BehaviorSubject<string>('');

  mensagem$ = this.mensagem.asObservable();
  erro$ = this.erro.asObservable();

  mostrarMensagem(mensagem: string) {
    this.mensagem.next(mensagem);
    this.erro.next('');

    setTimeout(() => {
      this.limparMensagem();
    }, 3000);
  }

  mostrarErro(mensagem: string) {
    this.erro.next(mensagem);
    this.mensagem.next('');

    setTimeout(() => {
      this.limparErro();
    }, 3000);
  }

  limparMensagem() {
    this.mensagem.next('');
  }

  limparErro() {
    this.erro.next('');
  }
}
