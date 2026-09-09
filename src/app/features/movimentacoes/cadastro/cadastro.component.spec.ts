import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CadastroComponent } from './cadastro.component';

describe('CadastroComponent de movimentações', () => {
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('deve carregar as categorias da API no seletor', () => {
    const fixture = TestBed.createComponent(CadastroComponent);
    fixture.detectChanges();

    const request = httpController.expectOne(`${environment.apiUrl}/categorias`);
    expect(request.request.method).toBe('GET');
    request.flush([
      { id: '1', nome: 'Educação', slug: 'educacao', icone: 'book-open', cor: 'blue' }
    ]);
    fixture.detectChanges();

    const opcoes = Array.from(
      fixture.nativeElement.querySelectorAll('#categoria option') as NodeListOf<HTMLOptionElement>
    );
    expect(opcoes.some(opcao => opcao.value === 'educacao' && opcao.textContent?.trim() === 'Educação')).toBeTrue();
  });
});
