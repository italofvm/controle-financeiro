import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html'
})
export class ModalComponent {

  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  fechar() {
    this.close.emit();
  }

  confirmar() {
    this.confirm.emit();
  }
}
