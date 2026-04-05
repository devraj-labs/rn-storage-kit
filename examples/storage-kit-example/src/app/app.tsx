import { Box, Col, CoreText } from '@vajra-ui/core';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { DC, enableLogger, StorageDebugScreen } from '@devraj-labs/rn-storage-kit';
import { StorageSection } from '../storage-section';

// Enable debug logging at startup. In production use level: 'error' or omit entirely.
enableLogger({ level: 'debug', maxEntries: 300 });

export function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={DC.bg} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Col p={16} pb={100}>
          <CoreText fontSize={24} fontWeight="800" color={DC.white}>rn-storage-kit</CoreText>
          <CoreText fontSize={13} color={DC.dim}>@devraj-labs</CoreText>

          <Box mt={24}>
            {/* MMKV — fast, for non-sensitive data: preferences, cache, flags */}
            <StorageSection type="mmkv" />
            {/* Secure — Keychain/Keystore, for tokens and credentials */}
            <StorageSection type="secure" />
          </Box>

          <Box align="center" mt={8}>
            <CoreText fontSize={12} color={DC.faint}>
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
  safe: { flex: 1, backgroundColor: DC.bg },
  scroll: { flexGrow: 1 },
});
