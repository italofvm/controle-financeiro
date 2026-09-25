import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { CategoriaService } from '../../../core/services/categoria.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Categoria, CategoriaCor } from '../../../models/categoria';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

type CategoriaFormControls = {
  nome: FormControl<string>;
  icon: FormControl<string>;
  cor: FormControl<CategoriaCor>;
};

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, LucideDynamicIcon, ModalComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  readonly icones = [
    { valor: 'utensils', rotulo: 'Alimentação' },
    { valor: 'house', rotulo: 'Casa' },
    { valor: 'car', rotulo: 'Transporte' },
    { valor: 'gamepad-2', rotulo: 'Lazer' },
    { valor: 'laptop', rotulo: 'Tecnologia' },
    { valor: 'banknote', rotulo: 'Renda' },
    { valor: 'wallet-cards', rotulo: 'Carteira' },
    { valor: 'ellipsis', rotulo: 'Outros' }
  ];
  readonly cores: { valor: CategoriaCor; rotulo: string }[] = [
    { valor: 'red', rotulo: 'Vermelho' },
    { valor: 'orange', rotulo: 'Laranja' },
    { valor: 'blue', rotulo: 'Azul' },
    { valor: 'green', rotulo: 'Verde' },
    { valor: 'violet', rotulo: 'Violeta' },
    { valor: 'gray', rotulo: 'Cinza' }
  ];

  camposFormulario: FormGroup<CategoriaFormControls>;
  isEditando = false;
  isModalOpen = false;
  idCategoria?: string;

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private notificacaoService: NotificacaoService,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.camposFormulario = this.formBuilder.group<CategoriaFormControls>({
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(2)]),
      icon: this.formBuilder.control('ellipsis', Validators.required),
      cor: this.formBuilder.control<CategoriaCor>('blue', Validators.required)
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditando = true;
      this.idCategoria = id;
      this.carregarCategoria(id);
    }
  }

  carregarCategoria(id: string): void {
    this.categoriaService.getCategoria(id).subscribe({
      next: categoria => this.camposFormulario.patchValue(categoria),
      error: () => this.notificacaoService.mostrarErro('Não foi possível carregar a categoria.')
    });
  }

  salvarCategoria(): void {
    this.camposFormulario.markAllAsTouched();
    if (this.camposFormulario.invalid) {
      return;
    }

    if (this.isEditando) {
      this.atualizarCategoria();
      return;
    }

    this.cadastrarCategoria();
  }

  cadastrarCategoria(): void {
    const categoria = this.criarCategoriaDoFormulario();
    this.categoriaService.salvar(categoria).subscribe({
      next: () => {
        this.notificacaoService.mostrarMensagem('Categoria cadastrada com sucesso!');
        this.isModalOpen = true;
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível cadastrar a categoria.')
    });
  }

  atualizarCategoria(): void {
    if (!this.idCategoria) {
      return;
    }

    const categoria: Categoria = {
      id: this.idCategoria,
      ...this.criarCategoriaDoFormulario()
    };
    this.categoriaService.atualizar(categoria.id, {
      nome: categoria.nome,
      icon: categoria.icon,
      cor: categoria.cor,
      slug: categoria.slug
    }).subscribe({
      next: () => {
        this.notificacaoService.mostrarMensagem('Categoria atualizada com sucesso!');
        this.router.navigate(['/categorias']);
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível atualizar a categoria.')
    });
  }

  isCampoInvalido(nomeCampo: keyof CategoriaFormControls): boolean {
    const campo = this.camposFormulario.controls[nomeCampo];
    return campo.invalid && campo.touched;
  }

  adicionarOutra(): void {
    this.isModalOpen = false;
    this.camposFormulario.reset({ nome: '', icon: 'ellipsis', cor: 'blue' });
  }

  voltarParaCategorias(): void {
    this.isModalOpen = false;
    this.router.navigate(['/categorias']);
  }

  private criarCategoriaDoFormulario(): Omit<Categoria, 'id'> {
    const valores = this.camposFormulario.getRawValue();
    return {
      ...valores,
      nome: valores.nome.trim(),
      slug: this.criarSlug(valores.nome)
    };
  }

  private criarSlug(nome: string): string {
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

}
