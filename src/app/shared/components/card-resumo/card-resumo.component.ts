import { Component, Input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-card-resumo',
  imports: [LucideDynamicIcon],
  templateUrl: './card-resumo.component.html',
  styleUrls: ['./card-resumo.component.scss']
})
export class CardResumoComponent {
  @Input() titulo: string = '';
  @Input() valor: number = 0;
  @Input() tipo: 'saldo' | 'receita' | 'despesa' = 'saldo';
  @Input() icone: string = 'wallet';

  get valorFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valor);
  }
}
