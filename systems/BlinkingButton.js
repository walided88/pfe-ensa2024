import React, { useEffect, useRef  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Animated, Easing } from 'react-native';


export const BlinkingButton = ({ style, onPress, children }) => {
    const opacity = useRef(new Animated.Value(1)).current;
  
    useEffect(() => {
      const blink = () => {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start(() => blink());
      };
  
      blink();
    }, [opacity]);
  
    return (
      <Animated.View style={{ opacity }}>
        <TouchableOpacity style={style} onPress={onPress}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  export default BlinkingButton;
  