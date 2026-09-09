import { CategoriaSlug } from './categoria';

export interface Movimentacao {
  id: string;
  descricao: string;
  categoria: CategoriaSlug;
  data: string;
  tipo: 'receita' | 'despesa';
  valor: number;
}
