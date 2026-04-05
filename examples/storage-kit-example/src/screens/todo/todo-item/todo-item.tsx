import { Box, CorePressable, CoreText, Row } from '@vajra-ui/core';
import React from 'react';
import { DC } from '@devraj-labs/rn-storage-kit';
import { TTodoItemProps } from './todo-item-types';

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TTodoItemProps) {
  return (
    <Row
      borderWidth={1}
      borderColor={todo.done ? DC.border : DC.teal}
      rounded={10}
      px={12}
      py={10}
      mb={8}
      align="center"
      gap={8}
    >
      <CorePressable onPress={() => onToggle(todo.id)}>
        <Box
          w={20}
          h={20}
          rounded={4}
          borderWidth={2}
          borderColor={todo.done ? DC.teal : DC.dim}
          bg={todo.done ? DC.teal : 'transparent'}
          align="center"
          justify="center"
        >
          {todo.done && (
            <CoreText fontSize={12} color={DC.bg} fontWeight="700">✓</CoreText>
          )}
        </Box>
      </CorePressable>

      <Box flex={1}>
        <CoreText
          fontSize={14}
          color={todo.done ? DC.dim : DC.mid}
          style={todo.done ? { textDecorationLine: 'line-through' } : undefined}
        >
          {todo.text}
        </CoreText>
      </Box>

      <CorePressable onPress={() => onEdit(todo)} style={{ marginRight: 8 }}>
        <CoreText fontSize={13} color={DC.teal}>edit</CoreText>
      </CorePressable>

      <CorePressable onPress={() => onDelete(todo.id)}>
        <CoreText fontSize={13} color={DC.red}>del</CoreText>
      </CorePressable>
    </Row>
  );
}
