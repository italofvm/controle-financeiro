export interface CriarMovimentacao {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  categoriaId: string | null;
}
