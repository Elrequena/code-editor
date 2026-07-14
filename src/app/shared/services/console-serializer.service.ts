import { Injectable } from '@angular/core';
import { ConsoleMethod, SerializedArg } from '../models/console-entry.model';

@Injectable({ providedIn: 'root' })
export class ConsoleSerializerService {

  format(method: ConsoleMethod, args: SerializedArg[]): string {
    if (method === 'clear') return '';
    return args.map(arg => this.formatArg(arg)).join(' ');
  }

  private formatArg(arg: SerializedArg): string {
    switch (arg.type) {
      case 'string':
        return String(arg.value);
      case 'number':
      case 'boolean':
        return String(arg.value);
      case 'undefined':
        return 'undefined';
      case 'null':
        return 'null';
      case 'symbol':
      case 'bigint':
        return String(arg.value);
      case 'function':
        return arg.value;
      case 'error':
        return this.formatError(arg.value);
      case 'object':
      case 'array':
        return this.formatObject(arg.value);
      default:
        return String(arg.value);
    }
  }

  private formatError(err: any): string {
    const name = err.name || 'Error';
    const message = err.message || '';
    return message ? `${name}: ${message}` : name;
  }

  private formatObject(obj: any): string {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  }
}
