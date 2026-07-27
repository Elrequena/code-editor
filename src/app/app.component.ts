import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ThemeService } from './core/services/theme.service';
import { ScreenSizeService } from './core/services/screen-size.service';
import { ConsoleViewComponent } from './shared/console-view/console-view.component';
import { SplitGutterInteractionEvent } from 'angular-split';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild('consoleView') consoleView!: ConsoleViewComponent;

  private formBuilder = inject(FormBuilder);
  readonly themeService = inject(ThemeService);
  readonly screenSize = inject(ScreenSizeService);

  title = 'Mini Code Editor';

  selectedTheme = signal(this.themeService.currentTheme());
  themes = this.themeService.themes;

  editorSize = signal<number>(50);

  editorForm: FormGroup = this.formBuilder.group({
    editorControl: this.formBuilder.control(this.defaultCode),
    consoleControl: this.formBuilder.control(this.defaultCode)
  });

  constructor() {
    const editorChanges = this.editorForm.get('editorControl')?.valueChanges;
    if (editorChanges) {
      editorChanges.pipe(debounceTime(1000)).subscribe((code) => {
        this.editorForm.get('consoleControl')?.patchValue(code);
      });
    }
  }

  onThemeChange(themeName: string): void {
    this.selectedTheme.set(themeName);
    this.themeService.setTheme(themeName);
  }

  onSplitDragEnd(event: SplitGutterInteractionEvent): void {
    const size = event.sizes[0];
    if (typeof size === 'number') {
      this.editorSize.set(size);
    }
  }

  clearConsole(): void {
    this.consoleView?.clearConsole();
  }

  private get defaultCode(): string {
    return `function greet(name: string) {\n  console.log(\`Hello, \${name}!\`);\n  console.warn("This is a warning");\n  console.info("Some info here");\n  console.error("Oops, something went wrong!");\n  console.table([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);\n  console.time("timer");\n  for (let i = 0; i < 1000; i++) {}\n  console.timeEnd("timer");\n}\n\ngreet("World");`;
  }
}
