import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const LazyImage = ({ source, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isFocused]);

  return (
    <View style={style}>
      {isVisible && <Image source={source} style={style} />}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});

export default LazyImage;
