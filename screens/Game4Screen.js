import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Animated, ImageBackground, Dimensions, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Matter from 'matter-js';
import Character1 from '../components/Character1';
import MovingImage from '../systems/MovingImage';
import { setAddition } from '../store/actions';
import BgMusic from "../components/BgMusique";
import { incrementScoreAddition,incrementScoreDivision } from '../services/Database';
import * as Animatable from 'react-native-animatable';
import {setReturn } from '../store/actions';
import Lodash from 'lodash';

const { width, height } = Dimensions.get('window');

const imagesArray = [
  require('../assets/images/1DIVREP.webp'),
  require('../assets/images/2DIVREP.webp'),
  require('../assets/images/3DIVREP.webp'),
  require('../assets/images/4DIVREP.webp'),
  require('../assets/images/6DIVREP.webp'),
];

const randomImagesArray = [
  require('../assets/images/1DIV.webp'),
  require('../assets/images/2DIV.webp'),
  require('../assets/images/3DIV.webp'),
  require('../assets/images/4DIV.webp'),
  require('../assets/images/6DIV.webp'),
];

const initialPositions = [
  { x: width * 0.6, y: height * 0.11 },
  { x: width * 0.4, y: height * 0.13 },
  { x: width * 0.3, y: height * 0.3 },
  { x: width * 0.7, y: height * 0.5 },
  { x: width * 0.25, y: height * 0.6 },
];

const finalPositions = [
  { x: width * 0.4, y: height * 0.4 },
  { x: width * 0.4, y: height * 0.4 },
  { x: width * 0.4, y: height * 0.4 },
  { x: width * 0.1, y: height * 0.1 },
  { x: width * 0.1, y: height * 0.1 },
];



const initialCharacterPosition = { x: width * 0.5, y: height * 0.5 };

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


const Game4Screen = ({ navigation}) => {
  const dispatch = useDispatch();
  const characterPosition = useSelector((state) => state.position);
  const playerId = useSelector((state) => state.playerId); // Assurez-vous que playerId est correctement défini
  const isShow = useSelector((state) => state.isShowing);
  const retourX = useSelector((state) => state.retour);
  const [ordre, setOrdre] = useState(1);
  console.log(`retourX cccccccccccccsdssss`,retourX);

  const [addObj, setAddObj] = useState(0);
  const [images, setImages] = useState([]);
  const [randomImageIndex, setRandomImageIndex] = useState(null);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [currentScoreImage, setCurrentScoreImage] = useState(null);
  const engine = useRef(Matter.Engine.create({ enableSleeping: true }));
  const world = engine.current.world;
  const characterBody = useRef(null);
  const gameRef = useRef();
  const navigateToGemini = useCallback(() => navigation.navigate('Gemini'), [navigation]);
  const navigateToGame2 = useCallback(() => navigation.navigate('Game2'), [navigation]);

  /**
   * Initialise les images du jeu avec des positions et des sources aléatoires.
   * Utilise Lodash pour mélanger les positions initiales des images.
   */
  const initializeImages = () => {
    const shuffledImagesArray = imagesArray; // Tableau des images à afficher
    const shuffledPositionsArray = Lodash.shuffle([...initialPositions]); // Utilisation de Lodash pour mélanger les positions
    const now = Date.now(); // Obtenir le temps actuel en millisecondes depuis l'époque UNIX
    const initialImages = shuffledPositionsArray.map((pos, i) => ({
      //Création des objets image
      id: now + i, // Identifiant unique pour chaque image basé sur l'heure actuelle et l'index
      initialPosition: pos, // Position initiale de l'image
      finalPosition: finalPositions[i], // Position finale de l'image
      imageSource: shuffledImagesArray[i], // Source de l'image
      body: Matter.Bodies.rectangle(pos.x, pos.y, { enableSleeping: true }), // Corps physique de Matter.js associé à l'image
    }));
    setImages(initialImages); // Met à jour l'état avec les images initiales
    setRandomImageIndex(Math.floor(Math.random() * randomImagesArray.length)); // Sélectionne une image aléatoire
  
    initialImages.forEach(image => {
      Matter.World.add(world, image.body); // Ajoute les corps des images au monde de Matter.js
    });
  };
  
  /**
   * Redistribue les images après qu'une image a été retirée.
   */
  const redistributeImages = () => {
    setRandomImageIndex(Math.floor(Math.random() * randomImagesArray.length)); // Sélectionne une nouvelle image aléatoire
    if (gameRef.current) {
      gameRef.current.resetCharacterPosition(initialCharacterPosition.x, initialCharacterPosition.y); // Réinitialise la position du personnage
    }
    setShowCongratulation(false); // Cache l'image de félicitations
    initializeImages(); // Réinitialise les images
  };
  
  useEffect(() => {
    initializeImages(); // Initialise les images lors du montage du composant
  
    return () => {
      images.forEach(image => {
        Matter.World.remove(world, image.body); // Supprime les corps des images du monde de Matter.js lors du démontage du composant
      });
    };
  }, []);
  
  /**
   * Supprime une image du jeu.
   * 
   * @param {number} id Identifiant de l'image à supprimer.
   * @param {Object} body Corps Matter.js de l'image à supprimer.
   */
  const removeImage = useCallback((id, body) => {
    // setImages((prevImages) => prevImages.filter((image) => image.id !== id)); // Supprime l'image de l'état local
    // Matter.World.remove(world, body); // Supprime le corps de l'image du monde de Matter.js
  
    const imageIndex = images.findIndex(image => image.id === id); // Trouve l'index de l'image supprimée
    if (imageIndex === randomImageIndex) { // Si l'image supprimée est l'image aléatoire
      redistributeImages(); // Redistribue les images
      setAddObj((prevAddObj) => prevAddObj + 1); // Incrémente le compteur d'objets ajoutés
      dispatch(setAddition(addObj)); // Met à jour le score dans Redux

    } else {
      redistributeImages(); // Redistribue les images
    }
  }, [world, randomImageIndex, images]);
  
  // useEffect(() => {
  //   dispatch(setAddition(addObj)); // Met à jour le score dans Redux
  // }, [addObj, dispatch]);
  
  useEffect(() => {
    if (playerId && addObj >= 5 && !showCongratulation) {
      incrementScoreAddition(playerId, 10, () => {
        console.log(`Score addition incremented by 10 for player ID ${playerId}`); // Log l'incrémentation du score
      });
      setShowCongratulation(true); // Affiche l'image de félicitations
    } else {
      setCurrentScoreImage(scoreImages[addObj % scoreImages.length]); // Met à jour l'image du score
    }
  }, [addObj, playerId, showCongratulation]);
  
  useEffect(() => {
    if (isShow) {
      navigateToGemini(); // Navigue vers l'écran "Gemini" si isShow est vrai
      dispatch(setReturn(4)); // Met à jour l'état Redux pour retourX
    }
  }, [isShow, navigateToGemini, retourX]);
  
  

  return (
    <ImageBackground source={require('../assets/images/kitchen1gaming.webp')} style={styles.background}>
      <View style={styles.container}>
        {randomImageIndex !== null && (
          <View style={styles.randomImageContainer}>
            <Image source={randomImagesArray[randomImageIndex]} style={styles.randomImage} />
          </View>
        )}

  

        {images.map((image) => (
          <MovingImage
            key={image.id}
            initialPosition={image.initialPosition}
            finalPosition={image.finalPosition}
            imageSource={image.imageSource}
            characterPosition={characterPosition}
            onRemove={() => removeImage(image.id, image.body)}
            body={image.body}
          />
        ))}
        <Character1 ref={gameRef} />
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
    padding: 15,
    


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
export default Game4Screen;
