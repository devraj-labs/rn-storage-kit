import { Box, CorePressable, CoreText } from '@devraj-labs/vajra-ui-core';
import React, { memo, useState } from 'react';
import { DC } from '../debug-colors';
import { TDataRowProps } from '../storage-debug-screen-types';

function DebugDataRowComponent({ itemKey, value }: TDataRowProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <CorePressable
      bg={DC.surface}
      rounded={8}
      p={10}
      mb={6}
      borderLeftWidth={3}
      borderColor={DC.teal}
      onPress={() => setExpanded((v) => !v)}>
      <Box mb={3}>
        <CoreText fontSize={12} fontWeight="700" color={DC.teal} style={{ fontFamily: 'monospace' }} numberOfLines={1}>
          {itemKey}
        </CoreText>
      </Box>
      <CoreText fontSize={12} color={DC.mid} style={{ fontFamily: 'monospace' }} numberOfLines={expanded ? undefined : 1}>
        {value}
      </CoreText>
    </CorePressable>
  );
}

export const DebugDataRow = memo(DebugDataRowComponent);
