import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

const url = 'https://shels-macbook-pro.jerboa-kokanue.ts.net/'

export default function App() {
  
  return (
    <WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ uri: url }} // Update the source to point to your localhost address
    />
  );

//   return (
//     <WebView
//       style={styles.container}
//       originWhitelist={['*']}
//       source={{ html: '<h1><center>Hello world</center></h1>' }}
// />
//   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

