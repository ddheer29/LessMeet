import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {resetAndNavigate} from '../utils/NavigationUtils';
import {screenHeight, screenWidth} from '../utils/Constants';

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      resetAndNavigate('HomeScreen');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./../assets/images/g.png')}
        style={styles.image}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.7,
    resizeMode: 'contain',
  },
});
