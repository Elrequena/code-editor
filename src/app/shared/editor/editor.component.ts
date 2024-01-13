import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
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
export class EditorComponent implements OnInit, ControlValueAccessor {

  editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
  };
  
  editorControl: FormControl;

  code: any;
  
  isDisabled: boolean;
  
  onChange = (_:any) => { };

  onTouch = () => { };
  
  writeValue(value: any): void {
    if (value) {
      this.code = value || '';
      this.editorControl.patchValue(value);
    } else {
      this.code = '';
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.editorControl.valueChanges.subscribe(fn);
  }
  
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.editorControl = this.formBuilder.control("");
  }

}
