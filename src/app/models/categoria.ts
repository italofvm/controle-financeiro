export type CategoriaSlug = string;
export type CategoriaCor = 'red' | 'orange' | 'blue' | 'gray' | 'green' | 'violet';

export interface Categoria {
  id: string;
  nome: string;
  slug: CategoriaSlug;
  icone: string;
  cor: CategoriaCor;
}
