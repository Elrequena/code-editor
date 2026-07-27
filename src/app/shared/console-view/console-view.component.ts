import { Component, forwardRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ts from 'typescript';
import { ConsoleEntry, ConsoleMethod, SerializedArg } from '../../core/models/console-entry.model';
import { ConsoleSerializerService } from '../../core/services/console-serializer.service';

@Component({
  standalone: false,
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
export class ConsoleViewComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private serializer = inject(ConsoleSerializerService);

  entries = signal<ConsoleEntry[]>([]);
  private nextId = 1;
  private code = '';
  private worker: Worker | null = null;
  private onChange = (_: any) => {};

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.code = value;
      this.runCode();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  setDisabledState(): void {}

  ngOnInit(): void {
    this.worker = new Worker(
      new URL('./code-executor.worker', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (e: MessageEvent) => {
      if (e.data?.type === 'console-output') {
        this.handleConsoleOutput(e.data.method, e.data.args);
      }
    };
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
    this.worker = null;
  }

  clearConsole(): void {
    this.entries.set([]);
  }

  private handleConsoleOutput(method: ConsoleMethod, args: SerializedArg[]): void {
    const entry: ConsoleEntry = {
      id: this.nextId++,
      method,
      args,
      timestamp: Date.now(),
      formattedValue: this.serializer.format(method, args)
    };

    if (method === 'clear') {
      this.entries.set([]);
    } else {
      this.entries.update(current => [...current, entry]);
    }
  }

  private runCode(): void {
    if (!this.worker) return;

    this.entries.set([]);

    let transpiledCode: string;
    try {
      transpiledCode = ts.transpile(this.code, {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.None,
      });
    } catch (e: any) {
      this.handleConsoleOutput('error', [{ type: 'error', value: { message: e.message, name: e.name || 'Error', stack: '' } }]);
      return;
    }

    this.worker.postMessage({ type: 'execute', code: transpiledCode });
  }
}
