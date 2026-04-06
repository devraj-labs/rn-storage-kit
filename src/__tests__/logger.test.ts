import {
  enableLogger,
  disableLogger,
  getLogs,
  clearLogs,
  onNewLog,
  offNewLog,
  log,
  generateId,
} from '../logger/logger';
import { TStorageLogEntry } from '../logger/logger-types';
import { __resetAllInstances } from '../__mocks__/react-native-mmkv';

function makeEntry(overrides: Partial<TStorageLogEntry> = {}): TStorageLogEntry {
  return {
    id: generateId(),
    timestamp: Date.now(),
    adapter: 'mmkv',
    operation: 'get',
    key: 'test-key',
    durationMs: 1,
    secure: false,
    ...overrides,
  };
}

beforeEach(() => {
  __resetAllInstances();
  disableLogger();
  clearLogs();
});

describe('enableLogger / disableLogger', () => {
  it('does not record entries when disabled', () => {
    log(makeEntry());
    expect(getLogs()).toHaveLength(0);
  });

  it('records entries after enableLogger', () => {
    enableLogger({ level: 'debug' });
    log(makeEntry());
    expect(getLogs()).toHaveLength(1);
  });

  it('stops recording after disableLogger', () => {
    enableLogger({ level: 'debug' });
    log(makeEntry());
    disableLogger();
    log(makeEntry());
    expect(getLogs()).toHaveLength(1);
  });
});

describe('log levels', () => {
  it('records errors at error level', () => {
    enableLogger({ level: 'error' });
    log(makeEntry({ error: 'boom' }));
    expect(getLogs()).toHaveLength(1);
  });

  it('does not record successes at error level', () => {
    enableLogger({ level: 'error' });
    log(makeEntry());
    expect(getLogs()).toHaveLength(0);
  });

  it('records successes at info level', () => {
    enableLogger({ level: 'info' });
    log(makeEntry({ value: 'secret', result: 'secret' }));
    const entries = getLogs();
    expect(entries).toHaveLength(1);
    expect(entries[0].value).toBeUndefined();
    expect(entries[0].result).toBeUndefined();
  });

  it('records full detail at debug level', () => {
    enableLogger({ level: 'debug' });
    log(makeEntry({ value: 'hello', result: 'hello' }));
    const entries = getLogs();
    expect(entries[0].value).toBe('hello');
    expect(entries[0].result).toBe('hello');
  });

  it('never records at none level', () => {
    enableLogger({ level: 'none' });
    log(makeEntry());
    log(makeEntry({ error: 'boom' }));
    expect(getLogs()).toHaveLength(0);
  });
});

describe('maxEntries cap', () => {
  it('caps log list at maxEntries (FIFO)', () => {
    enableLogger({ level: 'debug', maxEntries: 3 });
    for (let i = 0; i < 5; i++) {
      log(makeEntry({ key: `key-${i}` }));
    }
    expect(getLogs()).toHaveLength(3);
  });
});

describe('clearLogs', () => {
  it('empties the log list', () => {
    enableLogger({ level: 'debug' });
    log(makeEntry());
    clearLogs();
    expect(getLogs()).toHaveLength(0);
  });
});

describe('listeners', () => {
  it('calls listener when a new entry is logged', () => {
    enableLogger({ level: 'debug' });
    const received: TStorageLogEntry[] = [];
    const handler = (e: TStorageLogEntry) => received.push(e);
    onNewLog(handler);
    log(makeEntry({ key: 'listened' }));
    offNewLog(handler);
    expect(received).toHaveLength(1);
    expect(received[0].key).toBe('listened');
  });

  it('does not call listener after offNewLog', () => {
    enableLogger({ level: 'debug' });
    const received: TStorageLogEntry[] = [];
    const handler = (e: TStorageLogEntry) => received.push(e);
    onNewLog(handler);
    offNewLog(handler);
    log(makeEntry());
    expect(received).toHaveLength(0);
  });
});

describe('secure value masking', () => {
  it('records secure entries with value as ***', () => {
    enableLogger({ level: 'debug' });
    log(makeEntry({ adapter: 'secure', secure: true, value: '***' }));
    const entries = getLogs();
    expect(entries[0].value).toBe('***');
  });
});
