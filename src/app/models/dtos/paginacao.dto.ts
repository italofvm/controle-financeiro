import { Movimentacao } from "../movimentacao";

export interface Paginacao {
  paginaAtual: number;
  itensPorPagina: number;
  totalItens: number;
  totalPaginas: number;
}

export interface MovimentacoesPaginadas {
  dados: Movimentacao[];
  paginacao: Paginacao;
}


