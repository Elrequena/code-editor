import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';
import { ConsoleViewComponent } from './shared/console-view/console-view.component';
import { EditorComponent } from './shared/editor/editor.component';
import { ThemeService } from './shared/services/theme.service';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets/monaco/min/vs',
  defaultOptions: {
    scrollBeyondLastLine: false,
    fontSize: 14,
    automaticLayout: true,
  },
};

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
    MonacoEditorModule.forRoot(monacoConfig)
  ],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useFactory: (themeService: ThemeService): NgxMonacoEditorConfig => ({
        ...monacoConfig,
        onMonacoLoad: () => themeService.onMonacoLoad(),
      }),
      deps: [ThemeService]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
