import { Box, Col } from '@devraj-labs/vajra-ui-core';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Modal } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { clearLogs, getLogs, offNewLog, onNewLog } from '../../logger/logger';
import { TStorageLogEntry } from '../../logger/logger-types';
import { DC } from './debug-colors';
import { DebugDataRow } from './debug-data-row';
import { DebugEmpty } from './debug-empty';
import { DebugFab } from './debug-fab';
import { DebugHeader } from './debug-header';
import { ALL_MMKV_IDS, readMmkvData } from './debug-helpers';
import { DebugLogRow } from './debug-log-row';
import { DebugTabBar } from './debug-tab-bar';
import { DebugToolbar } from './debug-toolbar';
import { TDebugTab, TSortOrder } from './storage-debug-screen-types';

// Module-level open signal — lets StorageDebugFab trigger StorageDebugScreen
// without shared React state or context. Both are siblings in the tree.
let _openDebug: (() => void) | null = null;
export const openStorageDebug = () => _openDebug?.();

const StorageDebugScreenComponent: React.FC = () => {
  if (!__DEV__) return null;

  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TDebugTab>('logs');
  const [logs, setLogs] = useState<TStorageLogEntry[]>(() => getLogs());
  const [mmkvData, setMmkvData] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TSortOrder>('newest');

  useEffect(() => {
    _openDebug = () => setVisible(true);
    return () => { _openDebug = null; };
  }, []);

  useEffect(() => {
    const handler = () => setLogs(getLogs());
    onNewLog(handler);
    return () => offNewLog(handler);
  }, []);

  useEffect(() => {
    if (visible && activeTab === 'data') {
      setMmkvData(readMmkvData());
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
    for (const id of ALL_MMKV_IDS) {
      try { new MMKV({ id }).clearAll(); } catch (_e) { /* ignore */ }
    }
    setMmkvData({});
  }, []);

  const toggleSort = useCallback(() => {
    setSort((s) => (s === 'newest' ? 'oldest' : 'newest'));
  }, []);

  const refreshData = useCallback(() => {
    setMmkvData(readMmkvData());
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
      <Box flex={1} justify="flex-end" bg={DC.overlay}>
        <Col h="80%" bg={DC.bg} roundedT={16} style={{ overflow: 'hidden' }}>
          <DebugHeader
            activeTab={activeTab}
            onClearLogs={handleClearLogs}
            onClearData={handleClearMmkv}
            onClose={() => setVisible(false)}
          />

          <DebugTabBar active={activeTab} onChange={setActiveTab} />

          <DebugToolbar
            activeTab={activeTab}
            search={search}
            sort={sort}
            onSearch={setSearch}
            onToggleSort={toggleSort}
            onRefresh={refreshData}
          />

          {activeTab === 'logs' ? (
            filteredLogs.length === 0 ? (
              <DebugEmpty text={search ? 'No logs match your search.' : 'No logs yet. Make a storage call.'} />
            ) : (
              <FlatList
                data={filteredLogs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <DebugLogRow item={item} />}
                contentContainerStyle={{ padding: 8 }}
                keyboardShouldPersistTaps="handled"
              />
            )
          ) : filteredDataEntries.length === 0 ? (
            <DebugEmpty text={search ? 'No keys match your search.' : 'MMKV store is empty.'} />
          ) : (
            <FlatList
              data={filteredDataEntries}
              keyExtractor={([k]) => k}
              renderItem={({ item: [k, v] }) => <DebugDataRow itemKey={k} value={v} />}
              contentContainerStyle={{ padding: 8 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </Col>
      </Box>
    </Modal>
  );
};

export const StorageDebugScreen = memo(StorageDebugScreenComponent);

const StorageDebugFabComponent: React.FC = () => {
  if (!__DEV__) return null;
  return <DebugFab onPress={openStorageDebug} />;
};

export const StorageDebugFab = memo(StorageDebugFabComponent);
