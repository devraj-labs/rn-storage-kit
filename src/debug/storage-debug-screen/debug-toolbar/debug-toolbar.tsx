import { Box, CorePressable, CoreText, CoreTextInput, Row } from '@devraj-labs/vajra-ui-core';
import React from 'react';
import { DC } from '../debug-colors';
import { TDebugToolbarProps } from './debug-toolbar-types';

export function DebugToolbar({ activeTab, search, sort, onSearch, onToggleSort, onRefresh }: TDebugToolbarProps) {
  return (
    <Row gap={8} px={10} py={8} borderBottomWidth={1} borderColor={DC.border} align="center">
      <Box flex={1}>
        <CoreTextInput
          bg={DC.surface}
          color={DC.mid}
          rounded={8}
          px={10}
          py={7}
          fontSize={12}
          borderWidth={1}
          borderColor={DC.border}
          placeholderColor={DC.dim}
          placeholder={activeTab === 'logs' ? 'Search key, op, error…' : 'Search key or value…'}
          value={search}
          onChangeText={onSearch}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={{ fontFamily: 'monospace' }}
        />
      </Box>
      <CorePressable
        onPress={activeTab === 'logs' ? onToggleSort : onRefresh}
        bg={DC.surface}
        rounded={8}
        borderWidth={1}
        borderColor={DC.border}
        px={10}
        py={7}>
        <CoreText fontSize={11} fontWeight="600" color={DC.teal} style={{ fontFamily: 'monospace' }}>
          {activeTab === 'logs' ? (sort === 'newest' ? '↓ Newest' : '↑ Oldest') : '↺ Refresh'}
        </CoreText>
      </CorePressable>
    </Row>
  );
}
