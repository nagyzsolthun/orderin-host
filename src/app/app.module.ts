import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProductListComponent } from './components/product-list/product-list.component'
import { LoginComponent } from './components/login/login.component';
import { OrderListItemComponent } from './components/order-list-item/order-list-item.component';
import { OrderEditorComponent } from './components/order-editor/order-editor.component';
import { OrderEditorItemComponent } from './components/order-editor-item/order-editor-item.component';


const routes: Routes = [
  { path: ':venueId/orders', component: OrderListComponent },
  { path: ':venueId/products', component: OrderListComponent },
  { path: ':venueId/order/:counter', component: OrderEditorComponent },
  { path: ':venueId', redirectTo: ":venueId/orders" },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    OrderListComponent,
    LoginComponent,
    ProductListComponent,
    OrderListItemComponent,
    OrderEditorComponent,
    OrderEditorItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
