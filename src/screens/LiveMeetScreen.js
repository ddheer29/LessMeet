import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const LiveMeetScreen = () => {
  return (
    <View style={styles.container}>
      <Text>LiveMeetScreen</Text>
    </View>
  );
};

export default LiveMeetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
