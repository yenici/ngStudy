import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GaugeComponent } from './components/gauge/gauge.component';
import { AudioComponent } from './components/audio/audio.component';
import { CheckersComponent } from './components/checkers/checkers.component';

@NgModule({
  declarations: [
    AppComponent,
    GaugeComponent,
    AudioComponent,
    CheckersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
