import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { OrderComponent } from './order/order.component';
import { ContactComponent } from './contact/contact.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'order', component: OrderComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'admin', component: AdminComponent}
];
