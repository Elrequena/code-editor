export type ConsoleMethod = 'log' | 'warn' | 'error' | 'info' | 'debug' | 'table' | 'time' | 'timeEnd' | 'assert' | 'clear' | 'count' | 'countReset' | 'group' | 'groupEnd' | 'groupCollapsed';

export interface SerializedArg {
  type: 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'object' | 'array' | 'function' | 'error' | 'symbol' | 'bigint';
  value: any;
}

export interface ConsoleEntry {
  id: number;
  method: ConsoleMethod;
  args: SerializedArg[];
  timestamp: number;
  formattedValue: string;
}
