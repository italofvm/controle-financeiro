import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { Categoria } from '../../models/categoria';
import { Movimentacao } from '../../models/movimentacao';
import { Usuario } from '../../models/usuario';
import { AuthService } from './auth.service';
import { CategoriaService } from './categoria.service';
import { FinanceiroService } from './financeiro.service';

type UsuarioExportado = Omit<Usuario, 'senha'>;

type BackupFinanceiro = {
  usuario: UsuarioExportado | null;
  movimentacoes: Movimentacao[];
  categorias: Categoria[];
};

@Injectable({
  providedIn: 'root'
})
export class ExportacaoService {

  constructor(
    private authService: AuthService,
    private financeiroService: FinanceiroService,
    private categoriaService: CategoriaService
  ) { }

  exportarDados(): Observable<void> {
    return forkJoin({
      movimentacoes: this.financeiroService.getMovimentacoes(1, 100),
      categorias: this.categoriaService.getCategorias()
    }).pipe(
      tap(({ movimentacoes, categorias }) => {
        this.baixarArquivo({
          usuario: this.obterUsuarioExportado(),
          movimentacoes: movimentacoes.dados,
          categorias
        });
      }),
      map(() => void 0)
    );
  }

  private obterUsuarioExportado(): UsuarioExportado | null {
    const usuario = this.authService.obterUsuario();

    if (!usuario) {
      return null;
    }

    const usuarioExportado = usuario;
    return usuarioExportado;
  }

  private baixarArquivo(dados: BackupFinanceiro): void {
    const conteudo = JSON.stringify(dados, null, 2);
    const arquivo = new Blob([conteudo], { type: 'application/json' });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'backup-financas.json';
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
