# Meu Controle Financeiro

Aplicação web responsiva para organizar receitas, despesas e categorias. Desenvolvida como projeto de aprendizado com Angular, consumindo uma API local.

> Este projeto utiliza autenticação e persistência simuladas. Não está preparado para uso em produção.

## Funcionalidades

- Login com sessão local e proteção de rotas.
- Dashboard mensal com saldo, receitas, despesas, últimas movimentações e resumo por categoria.
- Cadastro, edição, listagem, filtro, paginação e exclusão de movimentações.
- Cadastro, edição, listagem e exclusão de categorias.
- Interface de preferências de moeda e início do ciclo mensal.
- Cabeçalho com título dinâmico da rota e menu de perfil.
- Interface de perfil para edição de dados pessoais e senha.
- Layout responsivo com sidebar adaptada para telas pequenas.
- Estados de carregamento, mensagens de sucesso/erro e modais de confirmação.

## Tecnologias

- [Angular 19](https://angular.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular)
- [RxJS](https://rxjs.dev/)
- API REST local configurada nos arquivos de ambiente
- Jasmine e Karma para testes unitários

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm

## Como executar

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd controle-financeiro
npm install
```

Inicie a aplicação:

```bash
npm start
```

Acesse `http://localhost:4200`. A URL da API é configurada em `src/environments/`.

### Usuário de demonstração

```text
E-mail: usuario@email.com
Senha: abc123
```

As credenciais existem apenas para facilitar os testes locais. Não utilize dados reais.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento Angular. |
| `npm run build` | Gera a versão de produção em `dist/`. |
| `npm test` | Executa os testes unitários com Karma. |
| `npm run watch` | Compila em modo de desenvolvimento e observa alterações. |

## Estrutura do projeto

```text
src/app/
├── core/                    # Serviços, guardas e interceptor HTTP
│   ├── guards/
│   ├── interceptor/
│   └── services/
├── features/                # Telas e fluxos da aplicação
│   ├── auth/
│   ├── categorias/
│   ├── configuracoes/
│   ├── dashboard/
│   ├── movimentacoes/
│   └── perfil/
├── layout/                  # Estrutura visual principal
├── models/                  # Interfaces de domínio
└── shared/                  # Componentes reutilizáveis e pipes
	└── components/
```

## Arquitetura

O projeto usa componentes standalone e rotas do Angular. As páginas autenticadas são renderizadas dentro do `MainLayoutComponent`, que reúne sidebar, header e conteúdo da rota.

Os componentes acessam dados pelos serviços `AuthService`, `FinanceiroService` e `CategoriaService`. A URL da API é configurada nos arquivos de ambiente. Os modelos principais são `Usuario`, `Movimentacao` e `Categoria`.

## API

A aplicação consome os seguintes recursos REST:

| Recurso | Finalidade |
| --- | --- |
| `/usuarios` | Dados de usuários e autenticação. |
| `/movimentacoes` | Receitas e despesas. |
| `/categorias` | Categorias disponíveis para as movimentações. |

Exemplos de endpoints:

```text
GET    /movimentacoes
POST   /movimentacoes
PUT    /movimentacoes/:id
DELETE /movimentacoes/:id

GET    /categorias
POST   /categorias
PUT    /categorias/:id
DELETE /categorias/:id
```

## Limitações atuais

- Senhas e sessão ainda dependem da implementação da API; não há garantia de hash, token, HTTPS obrigatório ou isolamento real de dados no frontend.
- Cada usuário ainda não possui suas próprias movimentações e categorias.
- Preferências, perfil e cadastro de usuário ainda não persistem dados.
- A rota de perfil e o logout ainda precisam ser integrados ao fluxo de autenticação.

Para uma versão de produção, o próximo passo é adicionar um backend com banco de dados, senhas protegidas por hash, autenticação baseada em sessão/cookie seguro ou token, e validação de propriedade dos recursos no servidor.

## Contribuições

Sugestões e melhorias são bem-vindas. Para contribuir:

```bash
git checkout -b feature/minha-melhoria
git commit -m "feat: descreve a melhoria"
git push origin feature/minha-melhoria
```

Abra um Pull Request descrevendo a alteração e como ela foi testada.

## Licença

Este projeto é destinado a fins educacionais. Adicione uma licença antes de reutilizá-lo ou distribuí-lo publicamente.
