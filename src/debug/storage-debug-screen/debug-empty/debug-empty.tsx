import { Box, CoreText } from '@devraj-labs/vajra-ui-core';
import React from 'react';
import { DC } from '../debug-colors';

type TDebugEmptyProps = { text: string };

export function DebugEmpty({ text }: TDebugEmptyProps) {
  return (
    <Box flex={1} align="center" justify="center" p={32}>
      <CoreText fontSize={13} color={DC.faint} align="center" style={{ fontFamily: 'monospace' }}>
        {text}
      </CoreText>
    </Box>
  );
}
