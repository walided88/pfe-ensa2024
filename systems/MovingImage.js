import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import Matter from 'matter-js';
import FastImage from 'react-native-fast-image';
import {  setIsAnimating } from '../store/actions';
import { useDispatch} from 'react-redux';

const { width, height } = Dimensions.get('window');

/**
 * MovingImage
 * 
 * Ce composant représente une image animée qui se déplace de sa position initiale
 * à sa position finale lorsqu'elle est suffisamment proche de la position du personnage.
 *
 * @param {object} props - Les propriétés passées au composant.
 * @param {object} props.initialPosition - La position initiale de l'image.
 * @param {object} props.finalPosition - La position finale de l'image.
 * @param {string} props.imageSource - La source de l'image.
 * @param {function} props.onRemove - Callback appelé lorsque l'image est retirée.
 * @param {object} props.characterPosition - La position du personnage.
 * @param {object} props.characterDimensions - Les dimensions du personnage.
 * @param {object} props.body - Le corps Matter.js associé à l'image.
 */
const MovingImage = React.memo(({ initialPosition, finalPosition, imageSource, onRemove, characterPosition }) => {
  const position = useRef(new Animated.ValueXY(initialPosition)).current;
  const dispatch = useDispatch();

  // Initialise l'animation à la position initiale de l'image
  useEffect(() => {
    position.setValue(initialPosition); // Set L'initial position directly
    Animated.timing(position, {
      toValue: initialPosition,
      useNativeDriver: true,
    }).start();
  }, [initialPosition, position]);

  /**
   * Vérifie la distance entre l'image et le personnage et déclenche l'animation si nécessaire.
   */
  const checkDistanceAndAnimate = useCallback(() => {
    const adjustedCharacterPosition = {
      x: characterPosition.x,
      y: characterPosition.y,
    };

    const distance = Matter.Vector.magnitude(
      Matter.Vector.sub(position.__getValue(), adjustedCharacterPosition)
    );

    // Si l'image est suffisamment proche du personnage, déclenche l'animation vers la position finale
    if (distance < 75) {
      Animated.timing(position, {
        toValue: finalPosition,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        if (onRemove) {
          dispatch(setIsAnimating(false));

          onRemove();
        }
      });
    }
  }, [characterPosition, position, finalPosition, onRemove]);

  // Vérifie périodiquement la distance entre l'image et le personnage
  useEffect(() => {
    const interval = setInterval(() => {
      checkDistanceAndAnimate();
    }, 1500);

    return () => clearInterval(interval);
  }, [checkDistanceAndAnimate]);

 
  const animatedStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y }
    ]
  };


  return (
    <Animated.View style={[animatedStyle, styles.imageContainer]}>
      <FastImage source={imageSource} style={styles.image} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
  },
  image: {
    
    width: width * 0.5, // Largeur de l'image
    height: height * 0.5, // Hauteur de l'image
    top: -height * 0.01,
    right: width * 0.25,
  },
});

export default MovingImage;
