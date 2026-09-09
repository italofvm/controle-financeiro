import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { ListaComponent as ListaCategoriasComponent } from './features/categorias/lista/lista.component';
import { ConfiguracoesComponent } from './features/configuracoes/configuracoes.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ListaComponent as ListaMovimentacoesComponent } from './features/movimentacoes/lista/lista.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [{
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
      data: { title: 'Dashboard' }
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      data: { title: 'Dashboard' }
    },
    {
      path: 'movimentacoes',
      component: ListaMovimentacoesComponent,
      data: { title: 'Movimentações' }
    },
    {
      path: 'movimentacoes/cadastro',
      loadComponent: () => import('./features/movimentacoes/cadastro/cadastro.component').then(m => m.CadastroComponent),
      data: { title: 'Cadastro de Movimentação' }
    },
    {
      path: 'movimentacoes/editar/:id',
      loadComponent: () => import('./features/movimentacoes/cadastro/cadastro.component').then(m => m.CadastroComponent),
      data: { title: 'Editar Movimentação' }
    },
    {
      path: 'categorias',
      component: ListaCategoriasComponent,
      data: { title: 'Categorias' }
    },
    {
      path: 'categorias/cadastro',
      loadComponent: () => import('./features/categorias/cadastro/cadastro.component').then(m => m.CadastroComponent),
      data: { title: 'Cadastro de Categoria' }
    },
    {
      path: 'categorias/editar/:id',
      loadComponent: () => import('./features/categorias/cadastro/cadastro.component').then(m => m.CadastroComponent),
      data: { title: 'Editar Categoria' }
    },
    {
      path: 'configuracoes',
      component: ConfiguracoesComponent,
      data: { title: 'Configurações' }
    },
    {
      path: 'perfil',
      loadComponent: () => import('./features/perfil/perfil.component').then(m => m.PerfilComponent),
      data: { title: 'Meu Perfil' }
    }
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
