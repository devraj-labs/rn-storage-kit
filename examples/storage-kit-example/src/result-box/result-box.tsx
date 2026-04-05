import { Box, CoreText } from '@vajra-ui/core';
import React from 'react';
import { TResultBoxProps } from './result-box-types';

// undefined = nothing run yet; null = key missing; string = result or error
export function ResultBox({ value }: TResultBoxProps) {
  if (value === undefined) return null;
  return (
    <Box bg="#13132a" rounded={8} p={10} mt={10}>
      <CoreText fontSize={11} color="#555577">Result:</CoreText>
      <CoreText fontSize={13} color="#ccccee">
        {value === null ? '(null)' : value}
      </CoreText>
    </Box>
  );
}
