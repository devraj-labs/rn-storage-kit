import { Box, CoreText, Row } from '@devraj-labs/vajra-ui-core';
import React, { memo } from 'react';
import { TStorageLogEntry } from '../../../logger/logger-types';
import { DC } from '../debug-colors';
import { formatTime } from '../debug-helpers';

type TDebugLogRowProps = { item: TStorageLogEntry };

function DebugLogRowComponent({ item }: TDebugLogRowProps) {
  const isError = Boolean(item.error);
  const isSecure = item.secure;
  const accentColor = isError ? DC.red : isSecure ? DC.purple : DC.teal;

  return (
    <Box bg={DC.surface} rounded={8} p={10} mb={6} borderLeftWidth={3} borderColor={accentColor}>
      <Row align="center" gap={6} mb={4} wrap="wrap">
        <Box bg={isSecure ? DC.badgeSecure : DC.badgeMMKV} rounded={4} px={6} py={2}>
          <CoreText fontSize={9} fontWeight="700" color={DC.white} style={{ fontFamily: 'monospace' }}>
            {item.adapter.toUpperCase()}
          </CoreText>
        </Box>
        <CoreText fontSize={13} fontWeight="700" color={accentColor} style={{ fontFamily: 'monospace', flex: 1 }}>
          {item.operation}
        </CoreText>
        {isSecure && (
          <Box bg={DC.lockBg} rounded={4} px={5} py={2} borderWidth={1} borderColor={DC.lockBorder}>
            <CoreText fontSize={9} color={DC.purple} style={{ fontFamily: 'monospace' }}>secure</CoreText>
          </Box>
        )}
        <CoreText fontSize={11} color={DC.meta} style={{ fontFamily: 'monospace' }}>{item.durationMs}ms</CoreText>
        <CoreText fontSize={10} color={DC.faint} style={{ fontFamily: 'monospace' }}>{formatTime(item.timestamp)}</CoreText>
      </Row>

      {item.key ? (
        <Box mt={2}>
          <CoreText fontSize={11} color={DC.meta} style={{ fontFamily: 'monospace' }} numberOfLines={1}>
            key: <CoreText fontSize={11} color={DC.mid}>{item.key}</CoreText>
          </CoreText>
        </Box>
      ) : null}

      {item.value ? (
        <Box mt={2}>
          <CoreText fontSize={11} color={DC.meta} style={{ fontFamily: 'monospace' }} numberOfLines={2}>
            value: <CoreText fontSize={11} color={isSecure ? DC.purple : DC.mid} style={isSecure ? { letterSpacing: 2 } : undefined}>{item.value}</CoreText>
          </CoreText>
        </Box>
      ) : null}

      {item.result !== undefined && item.result !== null ? (
        <Box mt={2}>
          <CoreText fontSize={11} color={DC.meta} style={{ fontFamily: 'monospace' }} numberOfLines={2}>
            result: <CoreText fontSize={11} color={isSecure ? DC.purple : DC.mid} style={isSecure ? { letterSpacing: 2 } : undefined}>{item.result}</CoreText>
          </CoreText>
        </Box>
      ) : null}

      {isError ? (
        <Box mt={4}>
          <CoreText fontSize={11} color={DC.red} style={{ fontFamily: 'monospace' }} numberOfLines={3}>
            {item.error}
          </CoreText>
        </Box>
      ) : null}
    </Box>
  );
}

export const DebugLogRow = memo(DebugLogRowComponent);
