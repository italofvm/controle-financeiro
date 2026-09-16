import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificacaoService } from '../../../core/services/notificacao.service';

@Component({
  selector: 'app-notificacao',
  imports: [],
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss']
})
export class NotificacaoComponent implements OnInit {
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(private notificacaoService: NotificacaoService,
    private destroyRef: DestroyRef) {

  }

  ngOnInit(): void {
    this.notificacaoService.mensagem$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(mensagem => {
        this.mensagemSucesso = mensagem;
      });
    this.notificacaoService.erro$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(mensagem => {
        this.mensagemErro = mensagem;
      });
  }

}
