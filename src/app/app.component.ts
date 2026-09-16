import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacaoComponent } from './shared/components/notificacao/notificacao.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificacaoComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'controle-financeiro';
}
