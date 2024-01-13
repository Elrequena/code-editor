import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ConsoleViewComponent } from './shared/console-view/console-view.component';
import { EditorComponent } from './shared/editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleViewComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule.forRoot() 
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
