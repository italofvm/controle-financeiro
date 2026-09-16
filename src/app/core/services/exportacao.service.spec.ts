import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario';
import { ExportacaoService } from './exportacao.service';

describe('ExportacaoService', () => {
  let service: ExportacaoService;
  let httpController: HttpTestingController;
  let createObjectUrlSpy: jasmine.Spy;
  let revokeObjectUrlSpy: jasmine.Spy;

  const usuario: Usuario = {
    id: '1',
    nome: 'Usuário Teste',
    email: 'usuario@email.com',
    senha: 'segredo'
  };

  beforeEach(() => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    createObjectUrlSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:backup');
    revokeObjectUrlSpy = spyOn(URL, 'revokeObjectURL');

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ExportacaoService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
    localStorage.clear();
  });

  it('deve buscar os dados e gerar o arquivo de backup sem exportar a senha', () => {
    service.exportarDados().subscribe(resultado => {
      expect(resultado).toBeUndefined();
    });

    const movimentacoesRequest = httpController.expectOne(`${environment.apiUrl}/movimentacoes`);
    expect(movimentacoesRequest.request.method).toBe('GET');
    movimentacoesRequest.flush([
      {
        id: '1',
        descricao: 'Salário',
        categoria: 'salario',
        data: '2026-09-01',
        tipo: 'receita',
        valor: 3200
      }
    ]);

    const categoriasRequest = httpController.expectOne(`${environment.apiUrl}/categorias`);
    expect(categoriasRequest.request.method).toBe('GET');
    categoriasRequest.flush([
      { id: '1', nome: 'Salário', slug: 'salario', icon: 'banknote', cor: 'green' }
    ]);

    const arquivo = createObjectUrlSpy.calls.mostRecent().args[0] as Blob;
    expect(arquivo.type).toBe('application/json');
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:backup');
  });
});
