import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Animated, TouchableWithoutFeedback, Dimensions, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Obstacle from '../systems/Obstacle';
import MusicPlayer from '../components/MusicPlayer';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import { setShow, setReturn } from '../store/actions';

const { width, height } = Dimensions.get('window');

const GameView = React.memo(({ handleTouch, animatedStyle, imageSource, world }) => {
  // const [showGameComponent, setShowGameComponent] = useState(false);
  const dispatch = useDispatch();

  const onHandleTouch = useCallback(handleTouch, [handleTouch]);

  const handleShow = useCallback(() => {
    dispatch(setShow(true));
  }, [dispatch]);

  // const handleHide = useCallback(() => {
  //   dispatch(setShow(false));
  //   setShowGameComponent(false);
  // }, [dispatch]);

  const obstacles = useMemo(() => (
    <>
      <Obstacle
        world={world}
        position={{ x: width * 0.25, y: height * 0.2 }}
        size={{ width: width * 0.5, height: height * 0.02 }}
        angle={(Math.PI / 4) * 2.6}
        // color='red'
      />
      <Obstacle
        world={world}
        position={{ x: width * 0.78, y: height * 0.6 }}
        size={{ width: width * 0.5, height: height * 0.02 }}
        angle={(Math.PI / 4) * 1.38}
        // color='red'
      />
      <Obstacle
        world={world}
        position={{ x: width * 0.6, y: height * 0.03 }}
        size={{ width: width * 0.6, height: height * 0.02 }}
        angle={(Math.PI / 2) * 0.001}
        // color='red'
      />
    </>
  ), [world]);

  return (
    <TouchableWithoutFeedback onPress={onHandleTouch}>
      <View style={styles.container}>
      <MusicPlayer file="running3.mp3" volume={0.9} />

          <Animated.View style={[styles.animatedBox, animatedStyle]}>

            <FastImage
              style={styles.boxImage}
              source={imageSource}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Animatable.View animation="pulse" iterationCount="infinite">
              <TouchableOpacity onPress={handleShow} style={styles.helpButton}>
                <Text style={styles.helpButtonText}>HELP?</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animated.View>
          {obstacles}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  animatedBox: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  boxImage: {
    width: width * 0.1,
    height: height * 0.4,
  },
  helpButton: {
    position: 'absolute',
    width: width * 0.1,
    height: height * 0.1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 111,
    justifyContent: 'center',
    alignItems: 'center',
    top: -height * 0.5,
    right: -width * 0.1,
  },
  helpButtonText: {
    color: '#007BFF',
    fontSize: 15,
    textAlign: 'center',
  },
  musicContainer: {
    flex: 1,
  },
});

export default GameView;
