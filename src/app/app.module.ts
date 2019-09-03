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
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientsListComponent } from './clients/clients-list.component';
import { ServicesOrdersComponent } from './services-orders/services-orders.component';
import { ClientAddEditComponent } from './clients/client-add-edit/client-add-edit.component';
import { VehiclesListComponent } from './vehicles/vehicles-list.component';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { VehicleAddEditComponent } from './vehicles/add-edit/vehicle-add-edit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { getPtBrPaginatorIntl } from 'src/shared/i18n/ptBr-paginator-intl';
import { HttpConfigInterceptor } from 'src/shared/interceptors/http.token.interceptor';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { ConfirmationComponent } from '../shared/components/confirmation/confirmation.component';
import { ServicesListComponent } from './services/services-list.component';
import { ServiceAddEditComponent } from './services/service-add-edit/service-add-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const appRoutes: Routes = [
    { path: '', component: ClientsListComponent },
    { path: 'clients', component: ClientsListComponent },
    { path: 'clients/:id', component: ClientAddEditComponent },
    { path: 'services-orders', component: ServicesOrdersComponent },
    { path: 'services', component: ServicesListComponent },
    { path: 'services/:id', component: ServiceAddEditComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        ClientsListComponent,
        ServicesOrdersComponent,
        ClientAddEditComponent,
        VehiclesListComponent,
        VehicleAddEditComponent,
        ConfirmationComponent,
        ServicesListComponent,
        ServiceAddEditComponent
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
        HttpClientModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
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
        MatStepperModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggleModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getPtBrPaginatorIntl() },
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    ],
    bootstrap: [AppComponent],
    entryComponents: [VehicleAddEditComponent, ConfirmationComponent],
})
export class AppModule {
}
