import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { FinanceiroService } from '../../../core/services/financeiro.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Categoria, CategoriaSlug } from '../../../models/categoria';
import { Movimentacao } from '../../../models/movimentacao';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

type MovimentacaoFormControls = {
  descricao: FormControl<string>;
  categoria: FormControl<CategoriaSlug>;
  data: FormControl<string>;
  tipo: FormControl<'receita' | 'despesa'>;
  valor: FormControl<number>;
};

@Component({
  selector: 'app-cadastro',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {

  camposFormulario: FormGroup<MovimentacaoFormControls>;
  isEditando: boolean = false;
  idMovimentacao?: string;
  isModalOpen: boolean = false;
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  categorias: Categoria[] = [];
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private financeiroService: FinanceiroService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private notificacaoService: NotificacaoService,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.camposFormulario = this.formBuilder.group<MovimentacaoFormControls>({
      descricao: this.formBuilder.control('', Validators.required),
      categoria: this.formBuilder.control<CategoriaSlug>('', Validators.required),
      data: this.formBuilder.control('', Validators.required),
      tipo: this.formBuilder.control<'receita' | 'despesa'>('receita', Validators.required),
      valor: this.formBuilder.control(0, [Validators.required, Validators.min(0.01)])
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditando = true;
      this.idMovimentacao = id;

      this.carregarMovimentacao(id);
    }

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

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: categorias => {
        this.categorias = categorias;
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível carregar as categorias.')
    });
  }

  carregarMovimentacao(id: string) {
    this.financeiroService.getMovimentacao(id).subscribe({
      next: (movimentacao) => {
        this.camposFormulario.patchValue(movimentacao);
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível carregar a movimentação.')
    })
  }

  salvarMovimentacao() {
    this.camposFormulario.markAllAsTouched();

    if (this.camposFormulario.invalid) {
      return;
    }

    if (this.isEditando) {
      this.atualizarMovimentacao();
    } else {
      this.cadastrarMovimentacao();
    }
  }

  cadastrarMovimentacao() {
    this.financeiroService.salvar(this.camposFormulario.getRawValue()).subscribe({
      next: () => {
        this.isModalOpen = true;
        this.notificacaoService.mostrarMensagem('Movimentação cadastrada com sucesso!');
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível cadastrar a movimentação.')
    });
  }

  atualizarMovimentacao() {
    if (!this.idMovimentacao) {
      return;
    }

    const movimentacao: Movimentacao = {
      id: this.idMovimentacao,
      ...this.camposFormulario.getRawValue()
    };

    this.financeiroService.atualizar(movimentacao).subscribe({
      next: () => {
        this.notificacaoService.mostrarMensagem('Movimentação atualizada com sucesso!');
        this.router.navigate(['/movimentacoes']);
      },
      error: () => this.notificacaoService.mostrarErro('Não foi possível atualizar a movimentação.')
    });
  }

  isCampoInvalido(nomeCampo: string): boolean {
    const campo = this.camposFormulario.get(nomeCampo);
    return !!campo?.invalid && !!campo?.touched;
  }

  adicionarOutra() {
    this.isModalOpen = false;
    this.camposFormulario.reset({
      descricao: '',
      categoria: '',
      data: '',
      tipo: 'receita',
      valor: 0
    });
  }

  voltarParaMovimentacoes() {
    this.isModalOpen = false;
    this.router.navigate(['/movimentacoes']);
  }
}
