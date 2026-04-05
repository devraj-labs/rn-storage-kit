import { Box, Col, CorePressable, CoreText, CoreTextInput, Row } from '@vajra-ui/core';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { MMKVStorageAdapter, SecureStorageAdapter } from '@devraj-labs/rn-storage-kit';
import { ResultBox } from '../result-box';
import { TStorageSectionProps } from './storage-section-types';

// Adapters are module-level singletons — not recreated on re-render.
// In a real app, lift these into a context or singleton module.
const mmkvAdapter = new MMKVStorageAdapter();
const secureAdapter = new SecureStorageAdapter();

export function StorageSection({ type }: TStorageSectionProps) {
  const adapter = type === 'mmkv' ? mmkvAdapter : secureAdapter;
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const isSecure = type === 'secure';
  const color = isSecure ? '#a78bfa' : '#34d399';

  // All adapter methods are async — including MMKV, which wraps its sync calls
  // for a unified interface with SecureStorageAdapter.
  async function run(action: () => Promise<unknown>) {
    setLoading(true);
    setResult(undefined);
    try {
      const res = await action();
      if (res == null) {
        setResult(null);
      } else if (Array.isArray(res)) {
        setResult(res.length === 0 ? '(no keys)' : res.join(', '));
      } else {
        setResult(String(res));
      }
    } catch (e) {
      setResult(`ERROR: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box borderWidth={1} borderColor={color} rounded={12} p={14} mb={20}>
      <Box bg={isSecure ? '#3b1f6e' : '#064e3b'} rounded={6} px={10} py={4} mb={12} style={{ alignSelf: 'flex-start' }}>
        <CoreText fontSize={11} fontWeight="700" color={color}>
          {isSecure ? 'SECURE (keychain)' : 'MMKV STORAGE'}
        </CoreText>
      </Box>

      <Col gap={8}>
        <CoreTextInput
          bg="#13132a" color="#ccccee" rounded={8} px={12} py={10}
          fontSize={14} borderWidth={1} borderColor="#1e1e3a"
          placeholderColor="#555577" placeholder="Key"
          value={key} onChangeText={setKey} autoCapitalize="none"
        />
        {/* Value is masked for the secure adapter */}
        <CoreTextInput
          bg="#13132a" color="#ccccee" rounded={8} px={12} py={10}
          fontSize={14} borderWidth={1} borderColor="#1e1e3a"
          placeholderColor="#555577" placeholder="Value (for set)"
          value={value} onChangeText={setValue}
          autoCapitalize="none" secureTextEntry={isSecure}
        />
      </Col>

      <Row wrap="wrap" gap={8} mt={8}>
        {/* set — writes to MMKV or Keychain depending on adapter */}
        <CorePressable onPress={() => run(() => adapter.set(key, value))} bg="#0d0d20" borderWidth={1} borderColor={color} rounded={8} px={14} py={8}>
          <CoreText fontSize={13} fontWeight="600" color={color}>set</CoreText>
        </CorePressable>

        {/* get — returns null if key doesn't exist */}
        <CorePressable onPress={() => run(() => adapter.get(key))} bg="#0d0d20" borderWidth={1} borderColor={color} rounded={8} px={14} py={8}>
          <CoreText fontSize={13} fontWeight="600" color={color}>get</CoreText>
        </CorePressable>

        {/* remove — no-op if key doesn't exist */}
        <CorePressable onPress={() => run(() => adapter.remove(key))} bg="#0d0d20" borderWidth={1} borderColor={color} rounded={8} px={14} py={8}>
          <CoreText fontSize={13} fontWeight="600" color={color}>remove</CoreText>
        </CorePressable>

        {/* getAllKeys — lists all keys in this adapter's storage */}
        <CorePressable onPress={() => run(() => adapter.getAllKeys())} bg="#0d0d20" borderWidth={1} borderColor={color} rounded={8} px={14} py={8}>
          <CoreText fontSize={13} fontWeight="600" color={color}>getAllKeys</CoreText>
        </CorePressable>

        {/* clear — wipes ALL keys. Destructive, use with care. */}
        <CorePressable onPress={() => run(() => adapter.clear())} bg="#0d0d20" borderWidth={1} borderColor="#f87171" rounded={8} px={14} py={8}>
          <CoreText fontSize={13} fontWeight="600" color="#f87171">clear</CoreText>
        </CorePressable>
      </Row>

      {loading && <ActivityIndicator color={color} style={{ marginTop: 8 }} />}
      <ResultBox value={result} />
    </Box>
  );
}
