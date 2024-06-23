import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Animated, TouchableWithoutFeedback, SafeAreaView, Dimensions, Text, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import FastImage from 'react-native-fast-image';
import Obstacle from '../systems/Obstacle';
import MusicPlayer from '../components/MusicPlayer';
import * as Animatable from 'react-native-animatable';
import GameComponent from '../components/GeminiHelper'; // Assurez-vous que le chemin est correct
import { useDispatch, useSelector } from 'react-redux';
import { setShow } from '../redux/actions';

const { width, height } = Dimensions.get('window');

const GameView = ({ navigation, handleTouch, animatedStyle, imageSource, box, world }) => {
  const onHandleTouch = useCallback(handleTouch, [handleTouch]);
  const navigateToGemini = useCallback(() => navigation.navigate('Gemini'), [navigation]);
  const dispatch = useDispatch();
  const isShow = useSelector((state) => state.isShowing);
  console.log(`isShow cccccccccccccsdssss`,isShow);

  const handleShow = () => {

    dispatch(setShow(true));

  };
  console.log(`isShow cccccccccccccsdssss`,isShow);

  const handleHide = () => {
    setShowGameComponent(false);
  };

  return (
    <TouchableWithoutFeedback onPress={onHandleTouch}>
      <View style={styles.container}>
        <GameEngine 
          style={styles.gameContainer} 
          systems={[]} 
          entities={{
            box: { body: box, size: [width * 0.1, height * 0.4], renderer: () => null }
          }}
        >
          
          <Animated.View style={[styles.animatedBox, animatedStyle]}>
            <FastImage
              style={{ width: width * 0.1, height: height * 0.4 }}
              source={imageSource}
              resizeMode={FastImage.resizeMode.contain}
            />

          <Animatable.View animation="pulse" iterationCount="infinite">
                <TouchableOpacity onPress={handleShow} style={styles.buttonText2}>
                  <Text style={styles.buttonText}>HELP?</Text>
                </TouchableOpacity>
              </Animatable.View>
          </Animated.View>
          <Obstacle 
            world={world} 
            position={{ x: width * 0.25, y: height * 0.2 }} 
            size={{ width: width * 0.5, height: height * 0.02 }} 
            angle={(Math.PI / 4) * 2.6} 
          />
          <Obstacle 
            world={world} 
            position={{ x: width * 0.72, y: height * 0.2 }} 
            size={{ width: width * 0.6, height: height * 0.02 }} 
            angle={(Math.PI / 4) * 1.34} 
          />
          <Obstacle 
            world={world} 
            position={{ x: width * 0.6, y: height * 0.03 }} 
            size={{ width: width * 0.6, height: height * 0.02 }} 
            angle={(Math.PI / 2) * 0.001} 
          />
        </GameEngine>
        <SafeAreaView style={styles.container}>
          <MusicPlayer file="running3.mp3" volume={0.9} />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
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
  overlay: {
    position: 'absolute',
    top: 33,
    left: 44,
  },
  gameComponentContainer: {
    width: 222,
    height: 222,
    backgroundColor: 'white',
    borderRadius: 222,
    justifyContent: 'center',
    alignItems: 'center',
    top: -height * 0.5,
    right: width * 0.4,
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    right: 10,
    padding: 2,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  buttonText2: {
    position: 'absolute',

    width: width * 0.1,
    height: height * 0.1,
    fontSize: 44,
    color: '#007BFF',
    padding: 10,
    position: 'absolute',
    top: -height * 0.5,
    right: -width * 0.1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 111,
    textAlign: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Comic Sans MS',
  },
});

export default GameView;
