import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpController: HttpTestingController;

  const categoria: Categoria = {
    id: '1',
    nome: 'Alimentação',
    slug: 'alimentacao',
    icon: 'utensils',
    cor: 'red'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(CategoriaService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('deve listar as categorias', () => {
    service.getCategorias().subscribe(categorias => {
      expect(categorias).toEqual([categoria]);
    });

    const request = httpController.expectOne(`${environment.apiUrl}/categorias`);
    expect(request.request.method).toBe('GET');
    request.flush([categoria]);
  });

  it('deve buscar uma categoria pelo id', () => {
    service.getCategoria('1').subscribe(resultado => {
      expect(resultado).toEqual(categoria);
    });

    const request = httpController.expectOne(`${environment.apiUrl}/categorias/1`);
    expect(request.request.method).toBe('GET');
    request.flush(categoria);
  });

  it('deve salvar, atualizar e excluir categorias', () => {
    const novaCategoria = {
      nome: categoria.nome,
      slug: categoria.slug,
      icon: categoria.icon,
      cor: categoria.cor
    };

    service.salvar(novaCategoria).subscribe();
    const post = httpController.expectOne(`${environment.apiUrl}/categorias`);
    expect(post.request.method).toBe('POST');
    post.flush(categoria);

    service.atualizar(categoria).subscribe();
    const put = httpController.expectOne(`${environment.apiUrl}/categorias/1`);
    expect(put.request.method).toBe('PUT');
    put.flush(categoria);

    service.deletar(categoria).subscribe();
    const deleteRequest = httpController.expectOne(`${environment.apiUrl}/categorias/1`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(null);
  });
});
