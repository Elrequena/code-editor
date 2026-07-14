interface SerializedArg {
  type: string;
  value: any;
}

const timers: Record<string, number> = {};
const counters: Record<string, number> = {};

function serializeArg(arg: any): SerializedArg {
  if (arg === undefined) return { type: 'undefined', value: undefined };
  if (arg === null) return { type: 'null', value: null };
  const t = typeof arg;
  if (t === 'string' || t === 'number' || t === 'boolean') return { type: t, value: arg };
  if (t === 'function') return { type: 'function', value: arg.toString() };
  if (t === 'symbol') return { type: 'symbol', value: arg.toString() };
  if (t === 'bigint') return { type: 'bigint', value: arg.toString() };
  if (arg instanceof Error) {
    return { type: 'error', value: { message: arg.message, name: arg.name || 'Error', stack: arg.stack || '' } };
  }
  if (Array.isArray(arg)) {
    try { return { type: 'array', value: JSON.parse(JSON.stringify(arg)) }; }
    catch { return { type: 'array', value: '[Circular]' }; }
  }
  try { return { type: 'object', value: JSON.parse(JSON.stringify(arg)) }; }
  catch { return { type: 'object', value: '[Circular]' }; }
}

function send(method: string, args: any[]): void {
  self.postMessage({ type: 'console-output', method, args: args.map(serializeArg) });
}

const methods = ['log', 'warn', 'error', 'info', 'debug', 'table', 'clear', 'assert', 'count', 'countReset'] as const;

methods.forEach((method) => {
  const original = (console as any)[method];
  if (!original) return;

  (console as any)[method] = (...args: any[]) => {
    if (method === 'time') {
      timers[args[0] || 'default'] = performance.now();
      return;
    }
    if (method === 'timeEnd') {
      const label = args[0] || 'default';
      const elapsed = timers[label] != null ? (performance.now() - timers[label]).toFixed(2) + 'ms' : '0ms';
      delete timers[label];
      args = [label + ': ' + elapsed];
    }
    if (method === 'count') {
      const ckey = args[0] || 'default';
      counters[ckey] = (counters[ckey] || 0) + 1;
      args = [ckey + ': ' + counters[ckey]];
    }
    if (method === 'countReset') {
      const rkey = args[0] || 'default';
      counters[rkey] = 0;
      return;
    }
    if (method === 'assert') {
      if (args[0]) return;
      args = ['Assertion failed:' + (args.length > 1 ? ' ' + args.slice(1).join(' ') : '')];
      send('error', args);
      return;
    }
    send(method, args);
  };
});

self.onerror = (msg, url, line, col, error) => {
  send('error', [{ message: String(msg), name: 'Error', stack: error?.stack || '' }]);
  return false;
};

self.onunhandledrejection = (e: PromiseRejectionEvent) => {
  send('error', [{ message: 'Unhandled Promise Rejection: ' + ((e.reason as any)?.message || e.reason), name: 'UnhandledRejection', stack: '' }]);
};

self.onmessage = (e: MessageEvent) => {
  if (e.data.type === 'execute') {
    try {
      new Function(e.data.code)();
    } catch (err: any) {
      send('error', [{ message: err.message, name: err.name || 'Error', stack: err.stack || '' }]);
    }
  }
};
