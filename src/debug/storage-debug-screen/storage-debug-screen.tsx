import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { TStorageLogEntry } from '../../logger/logger-types';
import { clearLogs, getLogs, offNewLog, onNewLog } from '../../logger/logger';
import {
  TDataRowProps,
  TDebugTab,
  TSortOrder,
  TTabBarProps,
} from './storage-debug-screen-types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_MMKV_ID = 'rn-storage-kit.default';

function readMmkvData(id: string): Record<string, string> {
  try {
    const store = new MMKV({ id });
    const out: Record<string, string> = {};
    for (const k of store.getAllKeys()) {
      const val = store.getString(k);
      if (val !== undefined) out[k] = val;
    }
    return out;
  } catch {
    return {};
  }
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const TabBarComponent: React.FC<TTabBarProps> = ({ active, onChange }) => (
  <View style={styles.tabBar}>
    {(['data', 'logs'] as TDebugTab[]).map((t) => (
      <TouchableOpacity
        key={t}
        style={[styles.tab, active === t && styles.tabActive]}
        onPress={() => onChange(t)}
        activeOpacity={0.7}>
        <Text style={[styles.tabText, active === t && styles.tabTextActive]}>
          {t === 'data' ? 'MMKV Data' : 'Logs'}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const TabBar = memo(TabBarComponent);

const DataRowComponent: React.FC<TDataRowProps> = ({ itemKey, value }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={styles.dataRow}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.8}>
      <Text style={styles.dataKey} numberOfLines={1}>
        {itemKey}
      </Text>
      <Text style={styles.dataValue} numberOfLines={expanded ? undefined : 1}>
        {value}
      </Text>
    </TouchableOpacity>
  );
};

const DataRow = memo(DataRowComponent);

type TLogRowInternalProps = { item: TStorageLogEntry };

const LogRowComponent: React.FC<TLogRowInternalProps> = ({ item }) => {
  const isError = Boolean(item.error);
  const isSecure = item.secure;
  const accentColor = isError ? C.red : isSecure ? C.purple : C.teal;

  return (
    <View style={[styles.logRow, { borderLeftColor: accentColor }]}>
      <View style={styles.logRowHeader}>
        <View style={[styles.badge, isSecure ? styles.badgeSecure : styles.badgeMMKV]}>
          <Text style={styles.badgeText}>{item.adapter.toUpperCase()}</Text>
        </View>
        <Text style={[styles.opText, { color: accentColor }]}>{item.operation}</Text>
        {isSecure && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>secure</Text>
          </View>
        )}
        <Text style={styles.durationText}>{item.durationMs}ms</Text>
        <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
      </View>

      {item.key ? (
        <Text style={styles.metaLine} numberOfLines={1}>
          key: <Text style={styles.metaVal}>{item.key}</Text>
        </Text>
      ) : null}

      {item.value ? (
        <Text style={styles.metaLine} numberOfLines={2}>
          value:{' '}
          <Text style={[styles.metaVal, isSecure && styles.maskedVal]}>{item.value}</Text>
        </Text>
      ) : null}

      {item.result !== undefined && item.result !== null ? (
        <Text style={styles.metaLine} numberOfLines={2}>
          result:{' '}
          <Text style={[styles.metaVal, isSecure && styles.maskedVal]}>{item.result}</Text>
        </Text>
      ) : null}

      {isError ? (
        <Text style={styles.errorLine} numberOfLines={3}>
          {item.error}
        </Text>
      ) : null}
    </View>
  );
};

const LogRow = memo(LogRowComponent);

function Empty({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const StorageDebugScreenComponent: React.FC = () => {
  if (!__DEV__) return null;

  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TDebugTab>('logs');
  const [logs, setLogs] = useState<TStorageLogEntry[]>(() => getLogs());
  const [mmkvData, setMmkvData] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TSortOrder>('newest');

  useEffect(() => {
    const handler = () => setLogs(getLogs());
    onNewLog(handler);
    return () => offNewLog(handler);
  }, []);

  useEffect(() => {
    if (visible && activeTab === 'data') {
      setMmkvData(readMmkvData(DEFAULT_MMKV_ID));
    }
  }, [visible, activeTab]);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.key?.toLowerCase().includes(q) ||
          e.operation.toLowerCase().includes(q) ||
          e.adapter.toLowerCase().includes(q) ||
          e.error?.toLowerCase().includes(q),
      );
    }
    return sort === 'oldest' ? [...result].reverse() : result;
  }, [logs, search, sort]);

  const filteredDataEntries = useMemo(() => {
    const entries = Object.entries(mmkvData);
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      ([k, v]) => k.toLowerCase().includes(q) || v.toLowerCase().includes(q),
    );
  }, [mmkvData, search]);

  const handleClearLogs = useCallback(() => {
    clearLogs();
    setLogs([]);
  }, []);

  const handleClearMmkv = useCallback(() => {
    try {
      new MMKV({ id: DEFAULT_MMKV_ID }).clearAll();
      setMmkvData({});
    } catch {}
  }, []);

  const toggleSort = useCallback(() => {
    setSort((s) => (s === 'newest' ? 'oldest' : 'newest'));
  }, []);

  const refreshData = useCallback(() => {
    setMmkvData(readMmkvData(DEFAULT_MMKV_ID));
  }, []);

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={styles.fabText}>DB</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.panel}>

            {/* Header */}
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Storage Debug</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={activeTab === 'logs' ? handleClearLogs : handleClearMmkv}
                  style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>
                    {activeTab === 'logs' ? 'Clear Logs' : 'Clear Data'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TabBar active={activeTab} onChange={setActiveTab} />

            {/* Toolbar */}
            <View style={styles.toolbar}>
              <TextInput
                style={styles.searchInput}
                placeholder={
                  activeTab === 'logs' ? 'Search key, op, error…' : 'Search key or value…'
                }
                placeholderTextColor={C.dim}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              {activeTab === 'logs' ? (
                <TouchableOpacity onPress={toggleSort} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>
                    {sort === 'newest' ? '↓ Newest' : '↑ Oldest'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={refreshData} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>↺ Refresh</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            {activeTab === 'logs' ? (
              filteredLogs.length === 0 ? (
                <Empty
                  text={
                    search ? 'No logs match your search.' : 'No logs yet. Make a storage call.'
                  }
                />
              ) : (
                <FlatList
                  data={filteredLogs}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <LogRow item={item} />}
                  contentContainerStyle={styles.listContent}
                  keyboardShouldPersistTaps="handled"
                />
              )
            ) : filteredDataEntries.length === 0 ? (
              <Empty
                text={search ? 'No keys match your search.' : 'MMKV store is empty.'}
              />
            ) : (
              <FlatList
                data={filteredDataEntries}
                keyExtractor={([k]) => k}
                renderItem={({ item: [k, v] }) => <DataRow itemKey={k} value={v} />}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export const StorageDebugScreen = memo(StorageDebugScreenComponent);

// ─── Palette ───────────────────────────────────────────────────────────────────

const C = {
  bg: '#0d0d1a',
  surface: '#13132a',
  border: '#1e1e3a',
  teal: '#00d4aa',
  purple: '#a78bfa',
  red: '#ff6b6b',
  white: '#ffffff',
  mid: '#ccccee',
  dim: '#555577',
  faint: '#333355',
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    zIndex: 9999,
  },
  fabText: {
    color: C.teal,
    fontWeight: '700',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  panel: {
    height: '80%',
    backgroundColor: C.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  panelTitle: {
    color: C.white,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#2a1a1a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.red,
  },
  clearBtnText: {
    color: C.red,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  closeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
  },
  closeBtnText: {
    color: '#aaaacc',
    fontSize: 14,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: C.teal,
  },
  tabText: {
    color: C.dim,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  tabTextActive: {
    color: C.teal,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: C.surface,
    color: C.mid,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: C.border,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: C.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  actionBtnText: {
    color: C.teal,
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  listContent: {
    padding: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: C.faint,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  logRow: {
    backgroundColor: C.surface,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
  },
  logRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeMMKV: {
    backgroundColor: '#1a3a5c',
  },
  badgeSecure: {
    backgroundColor: '#3a1a5c',
  },
  badgeText: {
    color: C.white,
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  lockBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#2a1a3a',
    borderWidth: 1,
    borderColor: '#a78bfa44',
  },
  lockText: {
    color: C.purple,
    fontSize: 9,
    fontFamily: 'monospace',
  },
  opText: {
    fontWeight: '700',
    fontSize: 13,
    fontFamily: 'monospace',
    flex: 1,
  },
  durationText: {
    color: '#888899',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  timeText: {
    color: C.faint,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  metaLine: {
    color: '#888899',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  metaVal: {
    color: C.mid,
  },
  maskedVal: {
    color: C.purple,
    letterSpacing: 2,
  },
  errorLine: {
    color: C.red,
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  dataRow: {
    backgroundColor: C.surface,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
  },
  dataKey: {
    color: C.teal,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: 3,
  },
  dataValue: {
    color: C.mid,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
