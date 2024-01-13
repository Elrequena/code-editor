import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'Mini code editor';

  editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
  };

  code:any = `function x() {\n  console.log("Epale vale!");\n}\nx();`

  editorForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.editorForm = this.formBuilder.group({
      editorControl: this.formBuilder.control(this.code),
      consoleControl: this.formBuilder.control(this.code)
    });

    this.editorForm.get('editorControl')?.valueChanges.pipe(debounceTime(1000)).subscribe( (code) => {
      this.editorForm.get('consoleControl')?.patchValue(code);
    });

  }

}

