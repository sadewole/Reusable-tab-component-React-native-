import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { TabPage, TabWrapper } from './components/TabComponent';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <View style={{ paddingTop: 100 }}>
        <TabWrapper items={[{ label: 'First' }, { label: 'Second' }]}>
          <View style={{ padding: 16 }}>
            <TabPage index={0}>
              <View style={{ backgroundColor: '#009D49', padding: 4 }}>
                <Text style={{ color: 'white' }}>This is first tab</Text>
              </View>
            </TabPage>
            <TabPage index={1}>
              <View style={{ backgroundColor: '#3267E6', padding: 4 }}>
                <Text style={{ color: 'white' }}>This is second tab</Text>
              </View>
            </TabPage>
          </View>
        </TabWrapper>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
});
