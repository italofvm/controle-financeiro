import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LucidePen, LucidePlus, LucideSearch, LucideTrash, provideLucideIcons } from '@lucide/angular';
import { environment } from '../../../../environments/environment';
import { ListaComponent } from './lista.component';

describe('ListaComponent de movimentações', () => {
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideLucideIcons(LucidePlus, LucideSearch, LucidePen, LucideTrash)
      ]
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('deve renderizar movimentações somente em cartões', () => {
    const fixture = TestBed.createComponent(ListaComponent);
    fixture.detectChanges();

    const request = httpController.expectOne(`${environment.apiUrl}/movimentacoes`);
    request.flush({
      dados: [
        {
          id: '1',
          descricao: 'Supermercado',
          categoria: 'alimentacao',
          data: '2026-09-04',
          tipo: 'despesa',
          valor: 150
        }
      ],
      paginacao: {
        paginaAtual: 1,
        itensPorPagina: 6,
        totalItens: 1,
        totalPaginas: 1
      }
    });
    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.querySelector('.movement-card')).toBeTruthy();
    expect(elemento.querySelector('table')).toBeFalsy();
  });
});
