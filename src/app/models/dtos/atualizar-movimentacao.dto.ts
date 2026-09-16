export interface AtualizarMovimentacao {
  descricao?: string;
  valor?: number;
  tipo?: 'receita' | 'despesa';
  data?: string;
  categoriaId?: string | null;
}
