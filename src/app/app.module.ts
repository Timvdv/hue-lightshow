import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';

import { ColorPickerModule } from 'angular2-color-picker';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ColorPickerModule,
  ],
  providers: [
    { provide: 'Window',  useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
