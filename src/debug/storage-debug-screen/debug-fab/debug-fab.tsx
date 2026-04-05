import { CorePressable, CoreText } from '@devraj-labs/vajra-ui-core';
import React from 'react';
import { DC } from '../debug-colors';

type TDebugFabProps = {
  onPress: () => void;
};

export function DebugFab({ onPress }: TDebugFabProps) {
  return (
    <CorePressable
      position="absolute"
      bottom={40}
      right={20}
      w={48}
      h={48}
      rounded={24}
      bg="#1a1a2e"
      align="center"
      justify="center"
      style={{ elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, zIndex: 9999 }}
      onPress={onPress}>
      <CoreText fontSize={13} fontWeight="700" color={DC.teal} style={{ fontFamily: 'monospace' }}>
        DB
      </CoreText>
    </CorePressable>
  );
}
