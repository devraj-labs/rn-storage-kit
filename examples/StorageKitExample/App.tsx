import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MMKVStorageAdapter,
  SecureStorageAdapter,
  StorageDebugScreen,
  enableLogger,
} from '@devraj-labs/rn-storage-kit';

// Enable logger in dev — debug level, persisted, capped at 300 entries
enableLogger({ level: 'debug', maxEntries: 300 });

const mmkvAdapter = new MMKVStorageAdapter();
const secureAdapter = new SecureStorageAdapter();

type TAdapterType = 'mmkv' | 'secure';

function ResultBox({ value }: { value: string | null | undefined }) {
  if (value === undefined) return null;
  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultLabel}>Result:</Text>
      <Text style={styles.resultValue}>{value === null ? '(null)' : value}</Text>
    </View>
  );
}

function StorageSection({ type }: { type: TAdapterType }) {
  const adapter = type === 'mmkv' ? mmkvAdapter : secureAdapter;
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setLoading(true);
    setResult(undefined);
    try {
      const res = await action();
      if (res === undefined || res === null) {
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

  const isSecure = type === 'secure';
  const color = isSecure ? '#a78bfa' : '#34d399';

  return (
    <View style={[styles.section, { borderColor: color }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.adapterBadge, { backgroundColor: isSecure ? '#3b1f6e' : '#064e3b' }]}>
          <Text style={[styles.adapterBadgeText, { color }]}>
            {isSecure ? 'SECURE (keychain)' : 'MMKV STORAGE'}
          </Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Key"
        placeholderTextColor="#555577"
        value={key}
        onChangeText={setKey}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Value (for set)"
        placeholderTextColor="#555577"
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        secureTextEntry={isSecure}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, { borderColor: color }]}
          onPress={() => run(() => adapter.set(key, value))}>
          <Text style={[styles.btnText, { color }]}>set</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { borderColor: color }]}
          onPress={() => run(() => adapter.get(key))}>
          <Text style={[styles.btnText, { color }]}>get</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { borderColor: color }]}
          onPress={() => run(() => adapter.remove(key))}>
          <Text style={[styles.btnText, { color }]}>remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { borderColor: color }]}
          onPress={() => run(() => adapter.getAllKeys())}>
          <Text style={[styles.btnText, { color }]}>getAllKeys</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={() => run(() => adapter.clear())}>
          <Text style={[styles.btnText, { color: '#f87171' }]}>clear</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator color={color} style={{ marginTop: 8 }} />}
      <ResultBox value={result} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>rn-storage-kit</Text>
        <Text style={styles.subtitle}>@devraj-labs</Text>

        <StorageSection type="mmkv" />
        <StorageSection type="secure" />

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Tap the DB button (bottom-right) to inspect storage &amp; logs
          </Text>
        </View>
      </ScrollView>
      <StorageDebugScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  subtitle: {
    color: '#555577',
    fontSize: 13,
    fontFamily: 'monospace',
    marginBottom: 24,
  },
  section: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  adapterBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adapterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: '#13132a',
    color: '#ccccee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e1e3a',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#0d0d20',
  },
  btnDanger: {
    borderColor: '#f87171',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  resultBox: {
    marginTop: 10,
    backgroundColor: '#13132a',
    borderRadius: 8,
    padding: 10,
  },
  resultLabel: {
    color: '#555577',
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  resultValue: {
    color: '#ccccee',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  hint: {
    alignItems: 'center',
    marginTop: 8,
  },
  hintText: {
    color: '#333355',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
