import { Box, Col, CoreText } from '@vajra-ui/core';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { enableLogger, StorageDebugScreen } from '@devraj-labs/rn-storage-kit';
import { StorageSection } from '../storage-section';

// Enable debug logging at startup. In production use level: 'error' or omit entirely.
enableLogger({ level: 'debug', maxEntries: 300 });

export function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Col p={16} pb={100}>
          <CoreText fontSize={24} fontWeight="800" color="#ffffff">rn-storage-kit</CoreText>
          <CoreText fontSize={13} color="#555577">@devraj-labs</CoreText>

          <Box mt={24}>
            {/* MMKV — fast, for non-sensitive data: preferences, cache, flags */}
            <StorageSection type="mmkv" />
            {/* Secure — Keychain/Keystore, for tokens and credentials */}
            <StorageSection type="secure" />
          </Box>

          <Box align="center" mt={8}>
            <CoreText fontSize={12} color="#333355">
              Tap the DB button (bottom-right) to inspect storage &amp; logs
            </CoreText>
          </Box>
        </Col>
      </ScrollView>
      {/* Remove StorageDebugScreen in production — exposes all keys and logs */}
      <StorageDebugScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a1a' },
  scroll: { flexGrow: 1 },
});
