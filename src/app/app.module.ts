import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { LOCALE_ID, Injectable, ErrorHandler } from '@angular/core';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import * as Sentry from '@sentry/electron';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { ClientsListComponent } from './clients/clients-list.component';
import { MenuComponent } from './menu/menu.component';
import { ClientAddEditComponent } from './clients/client-add-edit/client-add-edit.component';
import { VehiclesListComponent } from './vehicles/vehicles-list.component';
import { VehicleAddEditComponent } from './vehicles/add-edit/vehicle-add-edit.component';
import { ConfirmationComponent } from '../shared/components/confirmation/confirmation.component';
import { ServicesListComponent } from './services/services-list.component';
import { ServiceAddEditComponent } from './services/service-add-edit/service-add-edit.component';
import { WorkOrdersComponent } from './work-orders/work-orders-list.component';
import { WorkOrderAddEditComponent } from './work-orders/work-order-add-edit/work-order-add-edit.component';

import { getPtBrPaginatorIntl } from '../shared/i18n/material/ptBr-paginator-intl';
import { HttpConfigInterceptor } from '../shared/interceptors/http.token.interceptor';
import { FormatOnlyNamesPipe } from '../shared/pipes/format-only-names/format-only-names.pipe';
import { WorkOrderPreviewComponent } from './work-orders/work-order-preview/work-order-preview.component';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
    if (environment.production) {
      Sentry.init({ dsn: 'https://ab7bb4ef495746639c8ef42f24f5b8e8@sentry.io/1781934' });
    }
  }
  handleError(error) {
    console.error(error);
    if (environment.production) {
      Sentry.captureException(error.originalError || error);
    }
  }
}

registerLocaleData(localePt, 'pt-BR');

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const appRoutes: Routes = [
  { path: '', component: ClientsListComponent },
  { path: 'clients', component: ClientsListComponent },
  { path: 'clients/:id', component: ClientAddEditComponent },
  { path: 'work-orders', component: WorkOrdersComponent },
  { path: 'work-orders/:type', component: WorkOrdersComponent },
  { path: 'work-orders/:type/:id', component: WorkOrderAddEditComponent },
  { path: 'services', component: ServicesListComponent },
  { path: 'services/:id', component: ServiceAddEditComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ClientsListComponent,
    WorkOrdersComponent,
    WorkOrderAddEditComponent,
    ClientAddEditComponent,
    VehiclesListComponent,
    VehicleAddEditComponent,
    ConfirmationComponent,
    ServicesListComponent,
    ServiceAddEditComponent,
    FormatOnlyNamesPipe,
    WorkOrderPreviewComponent,
    HomeComponent
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
    MatSlideToggleModule,
    MatSelectModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getPtBrPaginatorIntl() },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    VehicleAddEditComponent,
    ConfirmationComponent,
    WorkOrderPreviewComponent
  ],
})
export class AppModule {
}
