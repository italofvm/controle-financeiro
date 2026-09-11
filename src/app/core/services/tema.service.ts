import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TemaAplicacao = 'claro' | 'escuro' | 'sistema';

@Injectable({
  providedIn: 'root'
})
export class TemaService {
  private readonly storageKey = 'tema-aplicacao';
  private readonly temaSubject = new BehaviorSubject<TemaAplicacao>(this.obterTemaSalvo());
  private readonly mediaQuery = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  tema$ = this.temaSubject.asObservable();

  constructor() {
    this.aplicarTema(this.temaSubject.value);
    this.observarTemaDoSistema();
  }

  obterTemaAtual(): TemaAplicacao {
    return this.temaSubject.value;
  }

  selecionarTema(tema: TemaAplicacao): void {
    localStorage.setItem(this.storageKey, tema);
    this.temaSubject.next(tema);
    this.aplicarTema(tema);
  }

  private obterTemaSalvo(): TemaAplicacao {
    const tema = localStorage.getItem(this.storageKey);

    if (tema === 'claro' || tema === 'escuro' || tema === 'sistema') {
      return tema;
    }

    return 'sistema';
  }

  private observarTemaDoSistema(): void {
    this.mediaQuery?.addEventListener('change', () => {
      if (this.temaSubject.value === 'sistema') {
        this.aplicarTema('sistema');
      }
    });
  }

  private aplicarTema(tema: TemaAplicacao): void {
    if (typeof document === 'undefined') {
      return;
    }

    const temaEfetivo = tema === 'sistema'
      ? this.mediaQuery?.matches ? 'escuro' : 'claro'
      : tema;

    document.documentElement.classList.toggle('dark', temaEfetivo === 'escuro');
    document.documentElement.style.colorScheme = temaEfetivo === 'escuro' ? 'dark' : 'light';
  }
}
