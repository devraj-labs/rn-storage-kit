import { Box, CorePressable, CoreText, Row } from '@devraj-labs/vajra-ui-core';
import React, { memo, useState } from 'react';
import { Clipboard } from 'react-native';
import { DC } from '../debug-colors';
import { TDataRowProps } from '../storage-debug-screen-types';

function DebugDataRowComponent({ itemKey, value }: TDataRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<'key' | 'value' | null>(null);

  const copy = (text: string, field: 'key' | 'value') => {
    Clipboard.setString(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <CorePressable
      bg={DC.surface}
      rounded={8}
      p={10}
      mb={6}
      borderLeftWidth={3}
      borderColor={DC.teal}
      onPress={() => setExpanded((v) => !v)}>

      <Row align="center" mb={3} gap={6}>
        <Box flex={1}>
          <CoreText
            fontSize={12}
            fontWeight="700"
            color={DC.teal}
            style={{ fontFamily: 'monospace' }}
            numberOfLines={expanded ? undefined : 1}>
            {itemKey}
          </CoreText>
        </Box>
        <CorePressable onPress={() => copy(itemKey, 'key')} bg={DC.faint} rounded={4} px={6} py={2}>
          <CoreText fontSize={9} color={copied === 'key' ? DC.teal : DC.meta} fontWeight="600">
            {copied === 'key' ? 'copied!' : 'copy key'}
          </CoreText>
        </CorePressable>
      </Row>

      <Row align="flex-start" gap={6}>
        <Box flex={1}>
          <CoreText
            fontSize={12}
            color={DC.mid}
            style={{ fontFamily: 'monospace' }}
            numberOfLines={expanded ? undefined : 2}>
            {value}
          </CoreText>
        </Box>
        <CorePressable onPress={() => copy(value, 'value')} bg={DC.faint} rounded={4} px={6} py={2} style={{ marginTop: 2 }}>
          <CoreText fontSize={9} color={copied === 'value' ? DC.teal : DC.meta} fontWeight="600">
            {copied === 'value' ? 'copied!' : 'copy val'}
          </CoreText>
        </CorePressable>
      </Row>

      <Box mt={4}>
        <CoreText fontSize={10} color={DC.faint}>{expanded ? '▲ collapse' : '▼ expand'}</CoreText>
      </Box>
    </CorePressable>
  );
}

export const DebugDataRow = memo(DebugDataRowComponent);
