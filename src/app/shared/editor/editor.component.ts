import { Component, OnInit, OnDestroy, input, output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true
    }
  ]
})
export class EditorComponent implements OnInit, OnDestroy, ControlValueAccessor {

  theme = input<string>('dark-neonblue');
  editorReady = output<any>();

  editorOptions: any = {};
  editorControl = new FormControl('');

  private sub: any;
  private onChange = (_: any) => {};

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.editorControl.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.sub = this.editorControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(): void {}

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.editorControl.disable() : this.editorControl.enable();
  }

  ngOnInit(): void {
    this.buildOptions();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onInit(editor: any): void {
    this.editorReady.emit(editor);
  }

  private buildOptions(): void {
    this.editorOptions = {
      theme: this.theme(),
      language: 'typescript',
      minimap: { enabled: true },
      fontSize: 14,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      wordWrap: 'off',
      lineNumbers: 'on',
      roundedSelection: true,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      padding: { top: 12, bottom: 12 },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      folding: true,
      formatOnPaste: true,
      formatOnType: true,
    };
  }
}
