import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Animated, ImageBackground, Dimensions, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Matter from 'matter-js';
import Game from '../components/Game2';
import MovingImage from '../systems/MovingImage';
import { setAddition } from '../redux/actions';
import BgMusic from "../components/BgMusique";
import { incrementScoreAddition } from '../services/Database';
import * as Animatable from 'react-native-animatable';
import { setShow,setReturn } from '../redux/actions';

const { width, height } = Dimensions.get('window');

const imagesArray = [
  require('../assets/images/1R.webp'),
  require('../assets/images/2R.webp'),
  require('../assets/images/3R.webp'),
  require('../assets/images/5R.webp'),
  require('../assets/images/6R.webp'),
];

const randomImagesArray = [
  require('../assets/images/1G.webp'),
  require('../assets/images/2G.webp'),
  require('../assets/images/3G.webp'),
  require('../assets/images/5G.webp'),
  require('../assets/images/6G.webp'),
];

const initialPositions = [
  { x: width * 0.55, y: height * 0.2 },
  { x: width * 0.4, y: height * 0.14 },
  { x: width * 0.3, y: height * 0.4 },
  { x: width * 0.66, y: height * 0.151 },
  { x: width * 0.73, y: height * 0.4 },
];

const finalPositions = [
  { x: width * 0.4, y: height * 0.4 },
  { x: width * 0.4, y: height * 0.4 },
  { x: width * 0.4, y: height * 0.4 },
  { x: width * 0.1, y: height * 0.1 },
  { x: width * 0.1, y: height * 0.1 },
];

const characterDimensions = {
  width: width * 0.4,
  height: height * 3,
};

const initialCharacterPosition = { x: width * 0.4, y: height * 0.4 };

const congratulationImage = require('../assets/images/congratulations.png');
const scoreImages = [
  require('../assets/images/0.webp'),
  require('../assets/images/1.webp'),
  require('../assets/images/2.webp'),
  require('../assets/images/3.webp'),
  require('../assets/images/4.webp'),
  require('../assets/images/5.webp'),
  require('../assets/images/6.webp'),
];

const GameScreen = ({ navigation, animatedStyle, showGameComponent }) => {
  const dispatch = useDispatch();
  const characterPosition = useSelector((state) => state.position);
  const playerId = useSelector((state) => state.playerId); // Assurez-vous que playerId est correctement défini
  const isShow = useSelector((state) => state.isShowing);
  const retourX = useSelector((state) => state.retour);

  const [addObj, setAddObj] = useState(0);
  const [images, setImages] = useState([]);
  const [randomImageIndex, setRandomImageIndex] = useState(null);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [currentScoreImage, setCurrentScoreImage] = useState(null);
  const engine = useRef(Matter.Engine.create({ enableSleeping: false }));
  const world = engine.current.world;
  const characterBody = useRef(null);
  const gameRef = useRef();
  const navigateToGemini = useCallback(() => navigation.navigate('Gemini'), [navigation]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleShow = () => {
    setShowGameComponent(true);
  };

  const handleHide = () => {
    setShowGameComponent(false);
  };

  const initializeImages = () => {
    const shuffledImagesArray = imagesArray;
    const shuffledPositionsArray = shuffleArray([...initialPositions]);
    const now = Date.now();
    const initialImages = shuffledPositionsArray.map((pos, i) => ({
      id: now + i,
      initialPosition: pos,
      finalPosition: finalPositions[i],
      imageSource: shuffledImagesArray[i],
      body: Matter.Bodies.rectangle(pos.x, pos.y, width * 0.1, height * 0.1, { isStatic: false }),
    }));
    setImages(initialImages);
    setRandomImageIndex(Math.floor(Math.random() * randomImagesArray.length));

    initialImages.forEach(image => {
      Matter.World.add(world, image.body);
    });
  };

  const redistributeImages = () => {
    setRandomImageIndex(Math.floor(Math.random() * randomImagesArray.length));
    if (gameRef.current) {
      gameRef.current.resetCharacterPosition(initialCharacterPosition.x, initialCharacterPosition.y);
    }
    setShowCongratulation(false);
    initializeImages();
  };

  useEffect(() => {
    initializeImages();

    return () => {
      images.forEach(image => {
        Matter.World.remove(world, image.body);
      });
    };
  }, []);

  const removeImage = useCallback((id, body) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    Matter.World.remove(world, body);

    const imageIndex = images.findIndex(image => image.id === id);
    if (imageIndex === randomImageIndex) {
      redistributeImages();
      setAddObj((prevAddObj) => prevAddObj + 1);
    } else {
      redistributeImages();
    }
  }, [world, randomImageIndex, images]);

  useEffect(() => {
    dispatch(setAddition(addObj));
  }, [addObj, dispatch]);

  useEffect(() => {
    if (playerId && addObj >= 5 && !showCongratulation) {
      incrementScoreAddition(playerId, 10, () => {
        console.log(`Score addition incremented by 10 for player ID ${playerId}`);
      });
      setShowCongratulation(true);
    } else {
      setCurrentScoreImage(scoreImages[addObj % scoreImages.length]);
    }
  }, [addObj, playerId, showCongratulation]);

  useEffect(() => {
    if (isShow) {
      dispatch(setReturn(2));
      navigateToGemini();

    }
  }, [isShow, navigateToGemini]);

  if (!characterPosition || characterPosition.x === undefined || characterPosition.y === undefined) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground source={require('../assets/images/kitchen1gaming.webp')} style={styles.background}>
      <View style={styles.container}>
        {randomImageIndex !== null && (
          <View style={styles.randomImageContainer}>
            <Image source={randomImagesArray[randomImageIndex]} style={styles.randomImage} />
          </View>
        )}

          <Animated.View style={[styles.animatedBox, animatedStyle]}>
          {isShow || (
            <Animatable.View animation="pulse" iterationCount="infinite">
              <TouchableOpacity onPress={navigateToGemini} style={styles.buttonText2}>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </Animated.View>

        {images.map((image) => (
          <MovingImage
            key={image.id}
            initialPosition={image.initialPosition}
            finalPosition={image.finalPosition}
            imageSource={image.imageSource}
            characterPosition={characterPosition}
            characterDimensions={characterDimensions}
            onRemove={() => removeImage(image.id, image.body)}
            body={image.body}
          />
        ))}
        <Game ref={gameRef} />
        {showCongratulation && (
          <View style={styles.congratulationContainer}>
            <Image source={congratulationImage} style={styles.congratulationImage} />
            <Animatable.View>
              <TouchableOpacity style={styles.resultsButton} onPress={() => navigation.navigate('Results')}>
                <Text style={styles.buttonText}>RESULTATS</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        )}
        {currentScoreImage && (
          <View style={styles.scoreContainer}>
            <Image source={currentScoreImage} style={styles.scoreImage} />
          </View>
        )}
              
     
        <BgMusic musicFile="bg1.mp3" volume={0.3} />
      </View>
    </ImageBackground>
  );
};

export default GameScreen;

// Styles pour le composant
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  congratulationContainer: {
    position: 'absolute',
    top: height * 0.009,
    left: width * 0.27,
    zIndex: 3,
  },
  resultsButton: {
    position: 'absolute',
    bottom: -height * 0.02,
    right: -width * 0.29,
    backgroundColor: '#007BFF',
    padding: 22,
    borderRadius: 20,
    marginTop: 20,
    shadowOpacity: 0.8,
    elevation: 5,
    width: width * 0.22,
    height: height * 0.25,

  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    color: 'white',
    padding: 10,


  },
  congratulationImage: {
    width: width * 0.4,
    height: height * 0.9,
  },
  scoreContainer: {
    position: 'absolute',
    top: height * 0.07,
    left: width * 0.03,
    zIndex: 3,
  },
  scoreImage: {
    width: width * 0.1,
    height: height * 0.25,
  },
  randomImageContainer: {
    position: 'absolute',
    top: height * 0.012,
    right: width * -0.37,
  },
  randomImage: {
    width: width,
    height: height,
    top: -height * 0.01,
    right: width * 0.37,
  },

  
});
