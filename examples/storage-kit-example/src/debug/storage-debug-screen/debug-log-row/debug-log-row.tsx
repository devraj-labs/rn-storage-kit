import { Box, CorePressable, CoreText, Row } from '@devraj-labs/vajra-ui-core';
import React, { memo, useState } from 'react';
import { Clipboard } from 'react-native';
import { TStorageLogEntry } from '@devraj-labs/rn-storage-kit';
import { DC } from '../debug-colors';
import { formatTime } from '../debug-helpers';

type TDebugLogRowProps = { item: TStorageLogEntry };

function DebugLogRowComponent({ item }: TDebugLogRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isError = Boolean(item.error);
  const isSecure = item.secure;
  const accentColor = isError ? DC.red : isSecure ? DC.purple : DC.teal;

  const copyAll = () => {
    const parts: string[] = [
      `adapter: ${item.adapter}`,
      `operation: ${item.operation}`,
      `time: ${formatTime(item.timestamp)}`,
      `duration: ${item.durationMs}ms`,
    ];
    if (item.key) parts.push(`key: ${item.key}`);
    if (item.value) parts.push(`value: ${item.value}`);
    if (item.result !== undefined && item.result !== null) parts.push(`result: ${item.result}`);
    if (item.error) parts.push(`error: ${item.error}`);
    Clipboard.setString(parts.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <CorePressable
      bg={DC.surface}
      rounded={8}
      p={10}
      mb={6}
      borderLeftWidth={3}
      borderColor={accentColor}
      onPress={() => setExpanded((v) => !v)}>

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
        <CorePressable onPress={copyAll} bg={DC.faint} rounded={4} px={6} py={2}>
          <CoreText fontSize={9} color={copied ? DC.teal : DC.meta} fontWeight="600">
            {copied ? 'copied!' : 'copy'}
          </CoreText>
        </CorePressable>
      </Row>

      {item.key ? (
        <Box mt={2}>
          <CoreText fontSize={11} color={DC.meta} style={{ fontFamily: 'monospace' }} numberOfLines={expanded ? undefined : 1}>
            key: <CoreText fontSize={11} color={DC.mid}>{item.key}</CoreText>
          </CoreText>
        </Box>
      ) : null}

      {item.value ? (
        <Box mt={2}>
          <CoreText fontSize={11} color={DC.meta} style={{ fontFamily: 'monospace' }} numberOfLines={expanded ? undefined : 2}>
            value: <CoreText fontSize={11} color={isSecure ? DC.purple : DC.mid} style={isSecure ? { letterSpacing: 2 } : undefined}>{item.value}</CoreText>
          </CoreText>
        </Box>
      ) : null}

      {item.result !== undefined && item.result !== null ? (
        <Box mt={2}>
          <CoreText fontSize={11} color={DC.meta} style={{ fontFamily: 'monospace' }} numberOfLines={expanded ? undefined : 2}>
            result: <CoreText fontSize={11} color={isSecure ? DC.purple : DC.mid} style={isSecure ? { letterSpacing: 2 } : undefined}>{item.result}</CoreText>
          </CoreText>
        </Box>
      ) : null}

      {isError ? (
        <Box mt={4}>
          <CoreText fontSize={11} color={DC.red} style={{ fontFamily: 'monospace' }} numberOfLines={expanded ? undefined : 3}>
            {item.error}
          </CoreText>
        </Box>
      ) : null}

      <Box mt={4}>
        <CoreText fontSize={10} color={DC.faint}>{expanded ? '▲ collapse' : '▼ expand'}</CoreText>
      </Box>
    </CorePressable>
  );
}

export const DebugLogRow = memo(DebugLogRowComponent);
