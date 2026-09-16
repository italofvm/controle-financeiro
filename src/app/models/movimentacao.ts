import { Categoria } from './categoria';

export interface Movimentacao {
  id: string;
  descricao: string;
  data: string;
  tipo: 'receita' | 'despesa';
  valor: number;


  categoriaId?: string | null;
  categoria?: Categoria | null;
}
