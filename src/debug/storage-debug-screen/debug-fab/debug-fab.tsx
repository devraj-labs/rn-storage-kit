import { CorePressable, CoreText } from '@devraj-labs/vajra-ui-core';
import React from 'react';
import { DC } from '../debug-colors';

type TDebugFabProps = {
  onPress: () => void;
};

export function DebugFab({ onPress }: TDebugFabProps) {
  return (
    <CorePressable
      bottom={40}
      right={20}
      w={48}
      h={48}
      rounded={24}
      bg="#1a1a2e"
      align="center"
      justify="center"
      style={{
        position: 'absolute',
        bottom: 80,
        right: 20,
      }}
      onPress={onPress}
    >
      <CoreText fontSize={13} fontWeight="700" color={DC.teal} style={{ fontFamily: 'monospace' }}>
        DB
      </CoreText>
    </CorePressable>
  );
}
