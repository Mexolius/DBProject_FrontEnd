import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { CountryDetailsComponent } from './country-details/country-details.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CountryNotFoundComponent } from './country-not-found/country-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { CountryListComponent } from './country-list/country-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CountriesComponent,
    CountryDetailsComponent,
    NavbarComponent,
    CountryListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'countries', component: CountriesComponent},
      {path: 'countries/:name', component: CountryDetailsComponent},
      {path: 'countryNotFound/:name', component: CountryNotFoundComponent},
      {path: 'countryList', component: CountryListComponent},
    ])
    
  ],
  providers: [],
  bootstrap:[AppComponent]
})
export class AppModule { }
