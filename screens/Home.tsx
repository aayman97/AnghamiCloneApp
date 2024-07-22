import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#131416'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131416',
  },
});

export default Home;
