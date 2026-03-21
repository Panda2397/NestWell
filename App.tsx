import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Letter from './letter';

export default function App() {
  if (shouldRenderLetter()) {
    return <Letter />;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

function shouldRenderLetter() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const path = window.location.pathname.toLowerCase();
  const query = window.location.search.toLowerCase();

  return path === '/letter' || query.includes('letter');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
