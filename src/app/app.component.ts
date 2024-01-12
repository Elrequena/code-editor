import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { transpile }  from 'typescript';
import { replaceMultipleStrings } from './functions/replace-multiple-strings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  title = 'code-editor';

  editorOptions = {
    theme: 'vs-dark',
    language: 'typescript'
  };

  code:any = `function x() {\n  console.log("Epale vale!");\n}\nx();`

  @ViewChild('iframe', { static: false }) iframe: ElementRef | undefined;

  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  ngAfterViewInit() {
    this.setupConsole();
  }


  clearIframeContent() {
    if (this.iframe && this.iframe.nativeElement.contentDocument) {
      const iframeDocument = this.iframe.nativeElement.contentDocument;
      iframeDocument.body.innerHTML = '';
    }
  }

  setupConsole(){

    this.clearIframeContent();

    if (this.iframe) {
      
      const logToConsole = `
        function logToConsole(message) {
          let consoleArea = document.getElementById('console');
          const newLine = document.createElement('div');
          newLine.textContent = message;
          consoleArea.appendChild(newLine);
        }
      `;
    
      const sanitizedCode: SafeHtml | any = this.sanitizer.bypassSecurityTrustHtml(logToConsole);
      
      const iframeDocument = this.iframe.nativeElement.contentDocument;
      
      const logToConsoleScriptElement = iframeDocument.createElement('script');
      logToConsoleScriptElement.innerHTML = logToConsole as string;// sanitizedCode['changingThisBreaksApplicationSecurity']
      
      const scriptElement = iframeDocument.createElement('script');
      const transpiledCode = transpile(this.code);

      const consoledCode = replaceMultipleStrings(transpiledCode,[
        ["console.log","logToConsole"]
      ])

      scriptElement.innerHTML = consoledCode as string; // sanitizedCode['changingThisBreaksApplicationSecurity']

      const consoleArea = iframeDocument.createElement('div');
      consoleArea.id = 'console';
      iframeDocument.body.appendChild(consoleArea);
      iframeDocument.body.appendChild(logToConsoleScriptElement);
      iframeDocument.body.appendChild(scriptElement);
    }
  }

  // Función para reiniciar el iframe e insertar nuevo código
  public reiniciarIframe() {
    this.setupConsole();
  }
}

