import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

type Moeda = {
  codigo: string;
  nome: string;
  simbolo: string;
};

@Component({
  selector: 'app-configuracoes',
  imports: [LucideDynamicIcon],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss'
})
export class ConfiguracoesComponent {

  moedas: Moeda[] = [
    { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$' },
    { codigo: 'USD', nome: 'Dólar Americano', simbolo: 'US$' },
    { codigo: 'EUR', nome: 'Euro', simbolo: '€' }
  ];
  moedaSelecionada = this.moedas[0];
  isCurrencyOpen = false;

  diasMensais = Array.from({ length: 28 }, (_, i) => i + 1);
  diaSelecionado = 1;
  isDayOpen = false;

  @ViewChild('currencyMenu') currencyMenu!: ElementRef;
  @ViewChild('dayMenu') dayMenu!: ElementRef;

  alternarMoedas() {
    this.isCurrencyOpen = !this.isCurrencyOpen;
  }

  selecionarMoeda(moeda: Moeda) {
    this.moedaSelecionada = moeda;
    this.isCurrencyOpen = false;
  }

  alternarDias() {
    this.isDayOpen = !this.isDayOpen;
    this.isCurrencyOpen = false;
  }

  selecionarDia(dia: number) {
    this.diaSelecionado = dia;
    this.isDayOpen = false;
  }

  @HostListener('document:click', ['$event'])
  fecharMenuAoClicarFora(event: MouseEvent) {
    if (
      event.target instanceof Node &&
      !this.currencyMenu.nativeElement.contains(event.target) &&
      !this.dayMenu.nativeElement.contains(event.target)
    ) {
      this.isCurrencyOpen = false;
      this.isDayOpen = false;
    }
  }

}
