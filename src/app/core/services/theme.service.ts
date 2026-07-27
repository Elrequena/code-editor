import { Injectable, signal, computed } from '@angular/core';

declare const monaco: any;

const THEME_STORAGE_KEY = 'code-editor-theme';

export interface ThemeInfo {
  name: string;
  label: string;
  isDark: boolean;
}

const THEMES: ThemeInfo[] = [
  { name: 'light-standard', label: 'Light Standard', isDark: false },
  { name: 'light-cloud', label: 'Light Cloud', isDark: false },
  { name: 'dark-retroconsole', label: 'Retro Console', isDark: true },
  { name: 'dark-neonblue', label: 'Neon Blue', isDark: true },
  { name: 'dark-obsidian', label: 'Obsidian', isDark: true },
];

function loadTheme(): string {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEMES.some(t => t.name === saved)) return saved;
  } catch {}
  return 'dark-neonblue';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {

  readonly themes = THEMES;

  readonly currentTheme = signal(loadTheme());

  readonly isDark = computed(() => THEMES.find(t => t.name === this.currentTheme())?.isDark ?? true);

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  setTheme(name: string): void {
    this.currentTheme.set(name);
    this.applyTheme(name);
    this.saveTheme(name);
    if (typeof monaco !== 'undefined') {
      monaco.editor.setTheme(name);
    }
  }

  onMonacoLoad(): void {
    monaco.editor.defineTheme('light-standard', {
      base: 'vs', inherit: true,
      rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'type', foreground: '267F99' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
      ],
      colors: {
        'editor.background': '#FFFFFF', 'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#F5F5F5', 'editor.selectionBackground': '#ADD6FF',
        'editorCursor.foreground': '#000000', 'editorLineNumber.foreground': '#237893',
        'editorWidget.background': '#F5F5F5',
      }
    });

    monaco.editor.defineTheme('light-cloud', {
      base: 'vs', inherit: true,
      rules: [
        { token: 'comment', foreground: '8E908C', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7C3AED' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'D97706' },
        { token: 'type', foreground: '2563EB' },
        { token: 'function', foreground: '7C3AED' },
        { token: 'variable', foreground: '1E293B' },
      ],
      colors: {
        'editor.background': '#F8FAFC', 'editor.foreground': '#1E293B',
        'editor.lineHighlightBackground': '#F1F5F9', 'editor.selectionBackground': '#C7D2FE',
        'editorCursor.foreground': '#7C3AED', 'editorLineNumber.foreground': '#94A3B8',
        'editorWidget.background': '#FFFFFF',
      }
    });

    monaco.editor.defineTheme('dark-retroconsole', {
      base: 'vs-dark', inherit: true,
      rules: [
        { token: 'comment', foreground: '3A5F3A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '33FF33' },
        { token: 'string', foreground: '00CC00' },
        { token: 'number', foreground: '33FF33' },
        { token: 'type', foreground: '00FF7F' },
        { token: 'function', foreground: '33FF33' },
        { token: 'variable', foreground: '00CC00' },
        { token: 'delimiter', foreground: '1A6B1A' },
      ],
      colors: {
        'editor.background': '#0A0F0A', 'editor.foreground': '#33FF33',
        'editor.lineHighlightBackground': '#0D1A0D', 'editor.selectionBackground': '#1A331A',
        'editorCursor.foreground': '#33FF33', 'editorLineNumber.foreground': '#1A6B1A',
        'editorWidget.background': '#0D1A0D',
      }
    });

    monaco.editor.defineTheme('dark-neonblue', {
      base: 'vs-dark', inherit: true,
      rules: [
        { token: 'comment', foreground: '4A5568', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00D4FF' },
        { token: 'string', foreground: '7DD3FC' },
        { token: 'number', foreground: '38BDF8' },
        { token: 'type', foreground: '06B6D4' },
        { token: 'function', foreground: '22D3EE' },
        { token: 'variable', foreground: '67E8F9' },
        { token: 'delimiter', foreground: '1E40AF' },
      ],
      colors: {
        'editor.background': '#0B1120', 'editor.foreground': '#E2E8F0',
        'editor.lineHighlightBackground': '#0F1A2E', 'editor.selectionBackground': '#1E3A5F',
        'editorCursor.foreground': '#00D4FF', 'editorLineNumber.foreground': '#1E40AF',
        'editorWidget.background': '#0F172A',
      }
    });

    monaco.editor.defineTheme('dark-obsidian', {
      base: 'vs-dark', inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'F472B6' },
        { token: 'string', foreground: 'A78BFA' },
        { token: 'number', foreground: 'FBBF24' },
        { token: 'type', foreground: '60A5FA' },
        { token: 'function', foreground: '34D399' },
        { token: 'variable', foreground: 'FAFAFA' },
        { token: 'delimiter', foreground: '71717A' },
      ],
      colors: {
        'editor.background': '#18181B', 'editor.foreground': '#FAFAFA',
        'editor.lineHighlightBackground': '#27272A', 'editor.selectionBackground': '#3F3F46',
        'editorCursor.foreground': '#F472B6', 'editorLineNumber.foreground': '#52525B',
        'editorWidget.background': '#27272A',
      }
    });

    this.setTheme(this.currentTheme());
  }

  private applyTheme(name: string): void {
    document.documentElement.setAttribute('data-theme', name);
  }

  private saveTheme(name: string): void {
    try { localStorage.setItem(THEME_STORAGE_KEY, name); } catch {}
  }
}
