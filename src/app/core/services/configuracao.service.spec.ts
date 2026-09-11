import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ConfiguracaoService } from './configuracao.service';

describe('ConfiguracaoService', () => {
  let service: ConfiguracaoService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ConfiguracaoService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('deve remover movimentações e categorias existentes', () => {
    service.limparTodosOsDados().subscribe(resultado => {
      expect(resultado).toBeUndefined();
    });

    const movimentacoesRequest = httpController.expectOne(`${environment.apiUrl}/movimentacoes`);
    expect(movimentacoesRequest.request.method).toBe('GET');
    movimentacoesRequest.flush([
      {
        id: '1',
        descricao: 'Internet',
        categoria: 'casa',
        data: '2026-09-01',
        tipo: 'despesa',
        valor: 120
      }
    ]);

    const categoriasRequest = httpController.expectOne(`${environment.apiUrl}/categorias`);
    expect(categoriasRequest.request.method).toBe('GET');
    categoriasRequest.flush([
      { id: '1', nome: 'Casa', slug: 'casa', icone: 'house', cor: 'orange' }
    ]);

    const deleteMovimentacaoRequest = httpController.expectOne(`${environment.apiUrl}/movimentacoes/1`);
    expect(deleteMovimentacaoRequest.request.method).toBe('DELETE');
    deleteMovimentacaoRequest.flush(null);

    const deleteCategoriaRequest = httpController.expectOne(`${environment.apiUrl}/categorias/1`);
    expect(deleteCategoriaRequest.request.method).toBe('DELETE');
    deleteCategoriaRequest.flush(null);
  });
});
