import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TStorageLogEntry } from '../../logger/logger-types';
import { clearLogs, getLogs, offNewLog, onNewLog } from '../../logger/logger';
import { TLogRowProps } from './storage-debug-panel-types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const LogRowComponent: React.FC<TLogRowProps> = ({ item }) => {
  const isError = Boolean(item.error);
  const isSecure = item.secure;
  const accentColor = isError ? C.red : isSecure ? C.purple : C.teal;

  return (
    <View style={[styles.row, { borderLeftColor: accentColor }]}>
      <View style={styles.rowHeader}>
        <View style={[styles.badge, isSecure ? styles.badgeSecure : styles.badgeMMKV]}>
          <Text style={styles.badgeText}>{item.adapter.toUpperCase()}</Text>
        </View>
        <Text style={[styles.method, { color: accentColor }]}>{item.operation}</Text>
        {isSecure && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>secure</Text>
          </View>
        )}
        <Text style={styles.duration}>{item.durationMs}ms</Text>
        <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
      </View>

      {item.key ? (
        <Text style={styles.meta} numberOfLines={1}>
          key: <Text style={styles.metaValue}>{item.key}</Text>
        </Text>
      ) : null}

      {item.value ? (
        <Text style={styles.meta} numberOfLines={2}>
          value: <Text style={[styles.metaValue, isSecure && styles.masked]}>{item.value}</Text>
        </Text>
      ) : null}

      {item.result !== undefined && item.result !== null ? (
        <Text style={styles.meta} numberOfLines={2}>
          result: <Text style={[styles.metaValue, isSecure && styles.masked]}>{item.result}</Text>
        </Text>
      ) : null}

      {isError ? (
        <Text style={styles.errorText} numberOfLines={3}>
          {item.error}
        </Text>
      ) : null}
    </View>
  );
};

const LogRow = memo(LogRowComponent);

// ─── Main component ────────────────────────────────────────────────────────────

const StorageDebugPanelComponent: React.FC = () => {
  if (!__DEV__) return null;

  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<TStorageLogEntry[]>(() => getLogs());
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const handler = () => setEntries(getLogs());
    onNewLog(handler);
    return () => offNewLog(handler);
  }, []);

  const handleClear = useCallback(() => {
    clearLogs();
    setEntries([]);
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.fabText}>DB</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Storage Logs</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No logs yet. Make a storage call to see it here.</Text>
              </View>
            ) : (
              <FlatList
                ref={listRef}
                data={entries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <LogRow item={item} />}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export const StorageDebugPanel = memo(StorageDebugPanelComponent);

// ─── Palette ───────────────────────────────────────────────────────────────────

const C = {
  teal: '#00d4aa',
  purple: '#a78bfa',
  red: '#ff6b6b',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    height: '75%',
    backgroundColor: '#0d0d1a',
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
    borderBottomColor: '#1e1e3a',
  },
  panelTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2a1a1a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.red,
  },
  clearBtnText: {
    color: C.red,
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
  },
  closeBtnText: {
    color: '#aaaacc',
    fontSize: 14,
  },
  listContent: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#666688',
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    backgroundColor: '#13132a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
  },
  rowHeader: {
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
    color: '#ffffff',
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
  method: {
    fontWeight: '700',
    fontSize: 13,
    fontFamily: 'monospace',
    flex: 1,
  },
  duration: {
    color: '#888899',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  time: {
    color: '#555577',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  meta: {
    color: '#888899',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  metaValue: {
    color: '#ccccee',
  },
  masked: {
    color: C.purple,
    letterSpacing: 2,
  },
  errorText: {
    color: C.red,
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
});
