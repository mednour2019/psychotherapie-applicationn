import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { SideBarComponent } from './layout/side-bar/side-bar.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContentWrapperComponent } from './layout/content-header/content-header.component';
import { SideBarDarkComponent } from './layout/side-bar-dark/side-bar-dark.component';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
//***************************** */
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// Material Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
// Material Popups & Modals
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
// Material Data tables
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GenericCheckboxgroupComponent } from './components/generic-checkboxgroup/generic-checkboxgroup.component';
import { AuthlayoutComponent } from './layout/authlayout/authlayout.component';
import { Dashboard1Component } from './components/private/dashboard1/dashboard1.component';
import { appInitializer } from './_helpers/app.initializer';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { SigninComponent } from './components/public/authentification/signin/signin.component';
import { StatisticsComponent } from './components/private/statistics/statistics.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ContactComponent } from './components/contact/contact.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AlertErrorComponent } from './components/alert-error/alert-error.component';
import { InputFilterComponent } from './components/input-filter/input-filter.component';
import { AlertSpinnerComponent } from './components/alert-spinner/alert-spinner.component';
import { DateFilterPeriodComponent } from './date-filter-period/date-filter-period.component';
import { PatientComponent } from './components/patient/patient.component';
import { RendezvousComponent } from './components/rendezvous/rendezvous.component';
import { ConsultComponent } from './components/consult/consult.component';
import { OrdenanceComponent } from './components/ordenance/ordenance.component';
import { FactureComponent } from './components/facture/facture.component';
import { PdfFactComponent } from './components/pdf-fact/pdf-fact.component';
import { PrendRdvComponent } from './components/prend-rdv/prend-rdv.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    Dashboard1Component,

    SideBarComponent,
    PageLoaderComponent,
    FooterComponent,
    ContentWrapperComponent,
    SideBarDarkComponent,
    GenericCheckboxgroupComponent,
    AuthlayoutComponent,
    SigninComponent,
      NotFoundComponent,
      ContactComponent,
      PaginationComponent,
      AlertErrorComponent,
      InputFilterComponent,
      AlertSpinnerComponent,
      DateFilterPeriodComponent,
      PatientComponent,
      RendezvousComponent,
      ConsultComponent,
      OrdenanceComponent,
      FactureComponent,
      PdfFactComponent,
      PrendRdvComponent,
  ]
  ,
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTreeModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [
   // { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService] },
   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
