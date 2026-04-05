import { Box, CoreText } from '@vajra-ui/core';
import React from 'react';
import { DC } from '@devraj-labs/rn-storage-kit';
import { TResultBoxProps } from './result-box-types';

// undefined = nothing run yet; null = key missing; string = result or error
export function ResultBox({ value }: TResultBoxProps) {
  if (value === undefined) return null;
  return (
    <Box bg={DC.surface} rounded={8} p={10} mt={10}>
      <CoreText fontSize={11} color={DC.dim}>Result:</CoreText>
      <CoreText fontSize={13} color={DC.mid}>
        {value === null ? '(null)' : value}
      </CoreText>
    </Box>
  );
}
