import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProductsComponent } from './components/products/products.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';

import { AuthService } from './services/auth/auth.service';
import { ProductsService } from './services/products/products.service';
import { CategoryService } from './services/categories/category.service';
import { OrderService } from './services/order/order.service';
import { SystemService } from './services/system/system.service';
import { ContractService } from './services/contract/contract.service';

import { AuthGuard } from './guards/auth.guards';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UsersComponent } from './components/users/users.component';
import { ContractComponent } from './pages/contract/contract.component';
import { ContractsComponent } from './components/contracts/contracts.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    ProductsComponent,
    AdminComponent,
    HeaderComponent,
    DashboardComponent,
    HomeComponent,
    NotFoundComponent,
    UsersComponent,
    ContractComponent,
    ContractsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PdfViewerModule,
    DragDropModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthService,
    ProductsService,
    CategoryService,
    OrderService,
    SystemService,
    ContractService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
