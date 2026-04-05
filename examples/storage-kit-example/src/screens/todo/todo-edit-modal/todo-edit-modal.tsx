import { Box, Col, CorePressable, CoreText, CoreTextInput, Row } from '@vajra-ui/core';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { DC } from '@devraj-labs/rn-storage-kit';
import { TTodoEditModalProps } from './todo-edit-modal-types';

export function TodoEditModal({ todo, onSave, onClose }: TTodoEditModalProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(todo?.text ?? '');
  }, [todo]);

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed || !todo) return;
    onSave(todo.id, trimmed);
  }

  return (
    <Modal visible={todo !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Box flex={1} bg="rgba(0,0,0,0.6)" justify="center" px={24}>
        <Col bg={DC.surface} rounded={14} p={20} gap={12}>
          <CoreText fontSize={16} fontWeight="700" color={DC.white}>Edit Todo</CoreText>

          <CoreTextInput
            bg={DC.bg}
            color={DC.mid}
            rounded={8}
            px={12}
            py={10}
            fontSize={14}
            borderWidth={1}
            borderColor={DC.teal}
            placeholderColor={DC.dim}
            placeholder="Todo text"
            value={text}
            onChangeText={setText}
            autoFocus
          />

          <Row gap={10} justify="flex-end">
            <CorePressable onPress={onClose} bg={DC.bg} borderWidth={1} borderColor={DC.border} rounded={8} px={16} py={8}>
              <CoreText fontSize={13} color={DC.dim}>Cancel</CoreText>
            </CorePressable>
            <CorePressable onPress={handleSave} bg={DC.teal} rounded={8} px={16} py={8}>
              <CoreText fontSize={13} fontWeight="600" color={DC.bg}>Save</CoreText>
            </CorePressable>
          </Row>
        </Col>
      </Box>
    </Modal>
  );
}
