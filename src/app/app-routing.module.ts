import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './guards/auth.guards';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route to Screen1
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
