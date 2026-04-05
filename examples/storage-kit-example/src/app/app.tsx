import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { enableLogger } from '@devraj-labs/rn-storage-kit';
import { DC, StorageDebugFab, StorageDebugScreen } from '../debug';
import { StoragePlaygroundScreen } from '../screens/storage-playground';
import { TodoScreen } from '../screens/todo';
import { TabBar, TTab } from '../tab-bar';

enableLogger({ level: 'debug', maxEntries: 300 });

export function App() {
  const [activeTab, setActiveTab] = useState<TTab>('todos');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={DC.bg} />
        <ScrollView contentContainerStyle={styles.scroll}>
          {activeTab === 'todos' ? <TodoScreen /> : <StoragePlaygroundScreen />}
        </ScrollView>
        <TabBar active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>
      <StorageDebugFab />
      <StorageDebugScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DC.bg },
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
});
