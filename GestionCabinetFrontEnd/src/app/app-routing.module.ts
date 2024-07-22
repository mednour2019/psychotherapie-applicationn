import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { Dashboard1Component } from './components/private/dashboard1/dashboard1.component';
import { AuthlayoutComponent } from './layout/authlayout/authlayout.component';
import { SigninComponent } from './components/public/authentification/signin/signin.component';
import { AuthGuard } from './_helpers/auth.guard';
import { StatisticsComponent } from './components/private/statistics/statistics.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ContactComponent } from './components/contact/contact.component';
import { PatientComponent } from './components/patient/patient.component';
import { RendezvousComponent } from './components/rendezvous/rendezvous.component';
import { ConsultComponent } from './components/consult/consult.component';
import { OrdenanceComponent } from './components/ordenance/ordenance.component';
import { FactureComponent } from './components/facture/facture.component';
import { PdfFactComponent } from './components/pdf-fact/pdf-fact.component';
import { PrendRdvComponent } from './components/prend-rdv/prend-rdv.component';
/*const routes: Routes = [
  {
   path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'account', redirectTo: './components/public/authentification/signin', pathMatch: 'full' },
    ],
  },
  // { path: 'login', component: SigninComponent },
  {
    path: 'authentication',
    component: AuthlayoutComponent,
    loadChildren: () =>
      import('./components/public/authentification/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: '**', component: Page404Component },
];*/
/*const accountModule = () => import('./components/public/authentification/authentication.module').then(x => x.AuthenticationModule);
const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  //{ path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];*/
const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: '', component: Dashboard1Component, canActivate: [AuthGuard] },
  { path: 'login', component: SigninComponent },
  {
    path: 'dashboard',
    component: Dashboard1Component,
    children: [
      {
        path: 'stat',
        component: StatisticsComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contact' },
      },
      {
        path: 'patient',
        component: PatientComponent,
        data: { title: 'patient' },
      },
      {
        path: 'rdv',
        component: RendezvousComponent,
        data: { title: 'Appointement' },
      },
      {
        path: 'conslt',
        component: ConsultComponent,
        data: { title: 'Consultation' },
      },
      {
        path: 'ord',
        component: OrdenanceComponent,
        data: { title: 'Prescription' },
      },
      {
        path: 'fctr',
        component: FactureComponent,
        data: { title: 'Invoice' },
      },
      {
        path: 'pdf-fctr',
        component: PdfFactComponent,
        data: { title: 'View Invoice' },
      },
      { path: 'prd-rdv', component: PrendRdvComponent,
      data: { title: 'Make an appointement' }
     },

    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: 'Page ERROR 404' },
  },
];

@NgModule({
  //imports: [RouterModule.forRoot(routes, {})],
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
