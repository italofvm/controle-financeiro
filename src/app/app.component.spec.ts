import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LucideArrowDown, LucideArrowLeftRight, LucideChartBarStacked, LucideLayoutDashboard, LucidePanelLeft, LucidePlus, LucideSettings, provideLucideIcons } from '@lucide/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideLucideIcons(LucideLayoutDashboard, LucideArrowLeftRight, LucideChartBarStacked, LucideSettings, LucidePlus, LucidePanelLeft, LucideArrowDown)
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'controle-financeiro' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('controle-financeiro');
  });

  it('should render the main navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')?.textContent).toContain('Categorias');
  });
});
