import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';

import { HueService } from './hue.service';
import { JamendoService } from './shared/services/jamendo.service';

import { ColorPickerModule } from 'angular2-color-picker';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HeaderComponent } from './header/header.component';
import { CreateComponent } from './create/create.component';
import { MusicComponent } from './music/music.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    HomeComponent,
    NotfoundComponent,
    HeaderComponent,
    CreateComponent,
    MusicComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ColorPickerModule
  ],
  providers: [
    { provide: 'Window',  useValue: window },
    HueService,
    JamendoService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
