import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {NgModule} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {AppComponent} from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

import { ClientsComponent } from './clients/clients.component';
import { RouterModule, Routes } from '@angular/router';
import { ServicesOrdersComponent } from './services-orders/services-orders.component';
import { ClientAddEditComponent } from './clients/add-edit/add-edit.component';

const appRoutes: Routes = [
    { path: '', component: ClientsComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'clients/:id', component: ClientAddEditComponent },
    { path: 'services-orders', component: ServicesOrdersComponent },
  ];

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        ClientsComponent,
        ServicesOrdersComponent,
        ClientAddEditComponent
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatTableModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatButtonModule,
        MatMenuModule,
        MatListModule,
        MatChipsModule,
        MatIconModule,
        MatTabsModule,
        MatBadgeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
