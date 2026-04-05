import { Box, Col, CorePressable, CoreText, CoreTextInput, Row } from '@vajra-ui/core';
import React from 'react';
import { DC } from '@devraj-labs/rn-storage-kit';
import { TodoItem } from './todo-item';
import { TodoEditModal } from './todo-edit-modal';
import { useTodoScreen } from './use-todo-screen';

export function TodoScreen() {
  const {
    todos,
    newText,
    editingTodo,
    pending,
    done,
    setNewText,
    setEditingTodo,
    handleAdd,
    handleToggle,
    handleDelete,
    handleSaveEdit,
    handleCloseEdit,
  } = useTodoScreen();

  return (
    <Col p={16} pb={100}>
      <CoreText fontSize={24} fontWeight="800" color={DC.white}>Todos</CoreText>
      <CoreText fontSize={13} color={DC.dim} style={{ marginBottom: 20 }}>
        Persisted with MMKVStorageAdapter
      </CoreText>

      <Row gap={8} mb={20}>
        <Box flex={1}>
          <CoreTextInput
            bg={DC.surface}
            color={DC.mid}
            rounded={8}
            px={12}
            py={10}
            fontSize={14}
            borderWidth={1}
            borderColor={DC.border}
            placeholderColor={DC.dim}
            placeholder="New todo..."
            value={newText}
            onChangeText={setNewText}
            autoCapitalize="sentences"
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
        </Box>
        <CorePressable onPress={handleAdd} bg={DC.teal} rounded={8} px={16} py={10} justify="center">
          <CoreText fontSize={14} fontWeight="700" color={DC.bg}>Add</CoreText>
        </CorePressable>
      </Row>

      {todos.length === 0 && (
        <Box align="center" mt={40}>
          <CoreText fontSize={14} color={DC.dim}>No todos yet. Add one above.</CoreText>
        </Box>
      )}

      {pending.length > 0 && (
        <Box mb={16}>
          <CoreText fontSize={11} fontWeight="700" color={DC.teal} style={{ marginBottom: 8, letterSpacing: 1 }}>
            PENDING
          </CoreText>
          {pending.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={setEditingTodo}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}

      {done.length > 0 && (
        <Box>
          <CoreText fontSize={11} fontWeight="700" color={DC.dim} style={{ marginBottom: 8, letterSpacing: 1 }}>
            DONE
          </CoreText>
          {done.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={setEditingTodo}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}

      <TodoEditModal
        todo={editingTodo}
        onSave={handleSaveEdit}
        onClose={handleCloseEdit}
      />
    </Col>
  );
}
