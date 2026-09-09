import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LucideBanknote, LucideCar, LucideEllipsis, LucideGamepad2, LucideHouse, LucideLaptop, LucideUtensils, LucideWalletCards, LucideX, provideLucideIcons } from '@lucide/angular';
import { CadastroComponent } from './cadastro.component';

describe('CadastroComponent de categorias', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideLucideIcons(LucideUtensils, LucideHouse, LucideCar, LucideGamepad2, LucideLaptop, LucideBanknote, LucideWalletCards, LucideEllipsis, LucideX)
      ]
    }).compileComponents();
  });

  it('deve exibir os controles para cadastrar uma categoria', () => {
    const fixture = TestBed.createComponent(CadastroComponent);
    fixture.detectChanges();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent).toContain('Nova categoria');
    expect(elemento.querySelector('input[formControlName="nome"]')).toBeTruthy();
    expect(elemento.querySelector('button[type="submit"]')?.textContent).toContain('Salvar');
  });
});
