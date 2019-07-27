import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MenuComponent } from './menu/menu.component';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientsListComponent } from './clients/clients-list.component';
import { ServicesOrdersComponent } from './services-orders/services-orders.component';
import { ClientAddEditComponent } from './clients/client-add-edit/client-add-edit.component';
import { VehiclesListComponent } from './vehicles/vehicles-list.component';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { VehicleAddEditComponent } from './vehicles/add-edit/vehicle-add-edit.component';
import { MatStepperModule } from '@angular/material/stepper';
import { getPtBrPaginatorIntl } from 'src/shared/i18n/ptBr-paginator-intl';

import { NgxMaskModule, IConfig} from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const appRoutes: Routes = [
    { path: '', component: ClientsListComponent },
    { path: 'clients', component: ClientsListComponent },
    { path: 'clients/:id', component: ClientAddEditComponent },
    { path: 'services-orders', component: ServicesOrdersComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        ClientsListComponent,
        ServicesOrdersComponent,
        ClientAddEditComponent,
        VehiclesListComponent,
        VehicleAddEditComponent
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        NgxMaskModule.forRoot(options),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatBadgeModule,
        MatDividerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatStepperModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getPtBrPaginatorIntl() }
      ],
    bootstrap: [AppComponent],
    entryComponents: [VehicleAddEditComponent],
})
export class AppModule {
}
