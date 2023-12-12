import { ProductsComponent } from '../../components/products/products.component';
import { HomeComponent } from '../../components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from 'src/app/guards/auth.guards';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route to Screen1
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

