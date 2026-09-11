import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LucideDownload, LucideMonitor, LucideMoon, LucideSettings2, LucideSun, LucideTrash, LucideTriangleAlert, provideLucideIcons } from '@lucide/angular';
import { of } from 'rxjs';
import { ConfiguracaoService } from '../../core/services/configuracao.service';
import { ExportacaoService } from '../../core/services/exportacao.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { TemaService } from '../../core/services/tema.service';
import { ConfiguracoesComponent } from './configuracoes.component';

describe('ConfiguracoesComponent', () => {
  let fixture: ComponentFixture<ConfiguracoesComponent>;
  let component: ConfiguracoesComponent;
  let temaService: jasmine.SpyObj<TemaService>;
  let exportacaoService: jasmine.SpyObj<ExportacaoService>;
  let configuracaoService: jasmine.SpyObj<ConfiguracaoService>;

  beforeEach(async () => {
    temaService = jasmine.createSpyObj<TemaService>('TemaService', ['obterTemaAtual', 'selecionarTema']);
    exportacaoService = jasmine.createSpyObj<ExportacaoService>('ExportacaoService', ['exportarDados']);
    configuracaoService = jasmine.createSpyObj<ConfiguracaoService>('ConfiguracaoService', ['limparTodosOsDados']);
    const notificacaoService = jasmine.createSpyObj<NotificacaoService>('NotificacaoService', ['mostrarMensagem', 'mostrarErro']);

    temaService.obterTemaAtual.and.returnValue('sistema');
    exportacaoService.exportarDados.and.returnValue(of(void 0));
    configuracaoService.limparTodosOsDados.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ConfiguracoesComponent],
      providers: [
        { provide: TemaService, useValue: temaService },
        { provide: ExportacaoService, useValue: exportacaoService },
        { provide: ConfiguracaoService, useValue: configuracaoService },
        { provide: NotificacaoService, useValue: notificacaoService },
        provideLucideIcons(LucideSettings2, LucideTriangleAlert, LucideSun, LucideMoon, LucideMonitor, LucideDownload, LucideTrash)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve exibir tema, exportação e zona de perigo sem moeda e ciclo mensal', () => {
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.textContent).toContain('Tema da Aplicação');
    expect(elemento.textContent).toContain('Exportar dados');
    expect(elemento.textContent).toContain('Zona de Perigo');
    expect(elemento.textContent).not.toContain('Moeda Principal');
    expect(elemento.textContent).not.toContain('Ciclo Mensal');
  });

  it('deve delegar a seleção de tema para o service', () => {
    component.selecionarTema('escuro');

    expect(component.temaSelecionado).toBe('escuro');
    expect(temaService.selecionarTema).toHaveBeenCalledWith('escuro');
  });

  it('deve abrir o modal antes de limpar os dados', () => {
    component.abrirConfirmacaoLimpeza();
    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.textContent).toContain('Limpar todos os dados?');
    expect(configuracaoService.limparTodosOsDados).not.toHaveBeenCalled();
  });
});
