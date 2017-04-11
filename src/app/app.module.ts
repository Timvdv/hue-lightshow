import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';

import { HueService } from './hue.service';

import { ColorPickerModule } from 'angular2-color-picker';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    HomeComponent,
    NotfoundComponent
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
    HueService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
