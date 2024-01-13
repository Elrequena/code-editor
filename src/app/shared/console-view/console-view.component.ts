import { Component, ElementRef, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { replaceMultipleStrings } from '../../functions/replace-multiple-strings';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as ts from 'typescript';

@Component({
  selector: 'app-console-view',
  templateUrl: './console-view.component.html',
  styleUrl: './console-view.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConsoleViewComponent),
      multi: true
    }
  ]
})
export class ConsoleViewComponent implements OnInit, ControlValueAccessor {
  
    @ViewChild('iframe', { static: false }) iframe: ElementRef | undefined;
  
  code: any = "";
  
  isDisabled: boolean;
  
  onChange = (_:any) => { };

  onTouch = () => { };
  
  writeValue(value: any): void {
    if (value) {
      this.code = value || '';
      this.setupConsole();
    } else {
      this.code = '';
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit(): void {
    
  }

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

      const styles = `
        div{
          font-family: Consolas, "Courier New", monospace;
          font-weight: normal;
          font-size: 14px;
          font-feature-settings: "liga" 0, "calt" 0;
          font-variation-settings: normal;
          line-height: 19px;
          letter-spacing: 0px;
          color:#d4d4d4
        }
      `

      const sanitizedCode: SafeHtml | any = this.sanitizer.bypassSecurityTrustHtml(logToConsole);
      
      const iframeDocument = this.iframe.nativeElement.contentDocument;

      const styleElement = iframeDocument.createElement('style');
      styleElement.textContent = styles;
      
      const logToConsoleScriptElement = iframeDocument.createElement('script');
      logToConsoleScriptElement.innerHTML = logToConsole as string;// sanitizedCode['changingThisBreaksApplicationSecurity']
      
      const scriptElement = iframeDocument.createElement('script');
      const transpiledCode = ts.transpile(this.code);

      const consoledCode = replaceMultipleStrings(transpiledCode,[
        ["console.log","logToConsole"]
      ])

      scriptElement.innerHTML = consoledCode as string; // sanitizedCode['changingThisBreaksApplicationSecurity']

      const consoleArea = iframeDocument.createElement('div');
      consoleArea.id = 'console';
      iframeDocument.head.appendChild(styleElement);
      iframeDocument.body.appendChild(consoleArea);
      iframeDocument.body.appendChild(logToConsoleScriptElement);
      iframeDocument.body.appendChild(scriptElement);
    }
  }

}
