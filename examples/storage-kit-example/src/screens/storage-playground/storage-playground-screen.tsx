import { Box, Col, CoreText } from '@vajra-ui/core';
import React from 'react';
import { DC } from '@devraj-labs/rn-storage-kit';
import { StorageSection } from '../../storage-section';

export function StoragePlaygroundScreen() {
  return (
    <Col p={16} pb={100}>
      <CoreText fontSize={24} fontWeight="800" color={DC.white}>rn-storage-kit</CoreText>
      <CoreText fontSize={13} color={DC.dim}>@devraj-labs</CoreText>

      <Box mt={24}>
        <StorageSection type="mmkv" />
        <StorageSection type="secure" />
      </Box>

      <Box align="center" mt={8}>
        <CoreText fontSize={12} color={DC.faint}>
          Tap the DB button (bottom-right) to inspect storage &amp; logs
        </CoreText>
      </Box>
    </Col>
  );
}
