import { CorePressable, CoreText, Row } from '@vajra-ui/core';
import React from 'react';
import { DC } from '@devraj-labs/rn-storage-kit';
import { TTab, TTabBarProps } from './tab-bar-types';

const TABS: { key: TTab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'storage', label: 'Storage' },
];

export function TabBar({ active, onChange }: TTabBarProps) {
  return (
    <Row borderTopWidth={1} borderTopColor={DC.border} bg={DC.bg}>
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <CorePressable
            key={key}
            flex={1}
            py={12}
            align="center"
            onPress={() => onChange(key)}
          >
            <CoreText
              fontSize={13}
              fontWeight={isActive ? '700' : '400'}
              color={isActive ? DC.teal : DC.dim}
            >
              {label}
            </CoreText>
          </CorePressable>
        );
      })}
    </Row>
  );
}
