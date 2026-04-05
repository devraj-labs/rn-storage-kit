import { CorePressable, CoreText, Row } from '@devraj-labs/vajra-ui-core';
import React, { memo } from 'react';
import { DC } from '../debug-colors';
import { TDebugTab, TTabBarProps } from '../storage-debug-screen-types';

const TABS: TDebugTab[] = ['data', 'logs'];

function DebugTabBarComponent({ active, onChange }: TTabBarProps) {
  return (
    <Row borderBottomWidth={1} borderColor={DC.border}>
      {TABS.map((t) => (
        <CorePressable
          key={t}
          flex={1}
          py={10}
          align="center"
          borderBottomWidth={active === t ? 2 : 0}
          borderColor={active === t ? DC.teal : 'transparent'}
          onPress={() => onChange(t)}>
          <CoreText
            fontSize={12}
            fontWeight="600"
            color={active === t ? DC.teal : DC.dim}
            style={{ fontFamily: 'monospace' }}>
            {t === 'data' ? 'MMKV Data' : 'Logs'}
          </CoreText>
        </CorePressable>
      ))}
    </Row>
  );
}

export const DebugTabBar = memo(DebugTabBarComponent);
