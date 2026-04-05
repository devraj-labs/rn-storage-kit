import { CorePressable, CoreText, Row } from '@devraj-labs/vajra-ui-core';
import React from 'react';
import { DC } from '../debug-colors';
import { TDebugHeaderProps } from './debug-header-types';

export function DebugHeader({ activeTab, onClearLogs, onClearData, onClose }: TDebugHeaderProps) {
  return (
    <Row align="center" justify="space-between" px={16} py={12} borderBottomWidth={1} borderColor={DC.border}>
      <CoreText fontSize={16} fontWeight="700" color={DC.white} style={{ fontFamily: 'monospace' }}>
        Storage Debug
      </CoreText>
      <Row gap={8}>
        <CorePressable
          onPress={activeTab === 'logs' ? onClearLogs : onClearData}
          bg={DC.clearBg}
          rounded={6}
          borderWidth={1}
          borderColor={DC.red}
          px={10}
          py={5}>
          <CoreText fontSize={11} fontWeight="600" color={DC.red} style={{ fontFamily: 'monospace' }}>
            {activeTab === 'logs' ? 'Clear Logs' : 'Clear Data'}
          </CoreText>
        </CorePressable>
        <CorePressable onPress={onClose} bg={DC.closeBg} rounded={6} px={10} py={5}>
          <CoreText fontSize={14} color={DC.closeFg}>✕</CoreText>
        </CorePressable>
      </Row>
    </Row>
  );
}
