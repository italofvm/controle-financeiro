import { TestBed } from '@angular/core/testing';
import { TemaService } from './tema.service';

describe('TemaService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  it('deve persistir e aplicar o tema escuro', () => {
    const service = TestBed.inject(TemaService);

    service.selecionarTema('escuro');

    expect(localStorage.getItem('tema-aplicacao')).toBe('escuro');
    expect(service.obterTemaAtual()).toBe('escuro');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });

  it('deve usar sistema como tema padrão', () => {
    const service = TestBed.inject(TemaService);

    expect(service.obterTemaAtual()).toBe('sistema');
  });
});
