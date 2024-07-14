import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Matter from 'matter-js';
import { setPosition, setCollision, setIsAnimating } from '../store/actions';
import GameView from '../screens/GameView';
import CollisionHandler from '../systems/CollisionHandler';


// Composant principal du jeu, enveloppé avec forwardRef pour permettre aux composants parents d'appeler ses fonctions
const Character1 = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  // Position initiale du personnage
  const position = useRef(new Animated.ValueXY({ x: 300, y: 200 })).current;
  const animationRef = useRef(null);
  
  // Création d'un moteur et d'un monde Matter.js
  const engine = useRef(Matter.Engine.create({ isSleeping:true }));
  const { world } = engine.current;

  // État pour gérer l'image actuelle du personnage
  const [currentImage, setCurrentImage] = useState(require('../assets/images/chefront.webp'));

  // Création d'un corps Matter.js pour le personnage
  const box = useRef(Matter.Bodies.rectangle(400, 400, 50, 50, { isStatic: false })).current; // Création du corps du personnage

  // Sélecteurs pour obtenir l'état du store Redux
  const isColliding = useSelector((state) => state.isColliding);

  // Désactivation de la gravité dans le monde Matter.js
  engine.current.gravity.y = 0;

  useEffect(() => {
    // Ajout du corps du personnage au monde Matter.js
    Matter.World.add(world, [box]);

    // Fonction pour mettre à jour le moteur Matter.js et la position du personnage
    const update = () => {
      const { x, y } = position.__getValue();
      Matter.Body.setPosition(box, { x, y });
      Matter.Engine.update(engine.current, 1000 / 60);
      requestAnimationFrame(update);
    };

    update();

    // Fonction de nettoyage pour retirer le corps et vider le moteur
    return () => {
      Matter.World.remove(world, box);
      Matter.Engine.clear(engine.current);
    };
  }, [position]);

  // Fonction pour déplacer le personnage à une position spécifiée
  const moveBoxToPosition = useCallback((x, y) => {
   


    const currentPos = position.__getValue();

    // Définir l'image en fonction de la direction du mouvement
    if (x < currentPos.x) {
      setCurrentImage(require('../assets/images/chefleft.webp'));
    } else if (x > currentPos.x) {
      setCurrentImage(require('../assets/images/chefright.webp'));
    }

    if (!isColliding) {
      dispatch(setIsAnimating(true));

      animationRef.current = Animated.timing(position, {
        toValue: { x, y },
        duration: 1500,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          dispatch(setPosition({ x, y }));
          dispatch(setIsAnimating(false));

          animationRef.current = null;
          setCurrentImage(require('../assets/images/chefront.webp'));

        }
      });
      
    } 
  }, [ position]);

  // Fonction pour gérer les événements tactiles et déplacer le personnage
  const handleTouch = useCallback((event) => {
    const { pageX, pageY } = event.nativeEvent;
    moveBoxToPosition(pageX - 25, pageY - 100);

  }, [ moveBoxToPosition]);

  // Fonction pour réinitialiser la position du personnage
  const resetCharacterPosition = useCallback((x, y) => {
    position.setValue({ x, y });
    Matter.Body.setPosition(box, { x, y });
    dispatch(setPosition({ x, y }));
  }, [position, box]);

  // Exposer la fonction resetCharacterPosition aux composants parents
  useImperativeHandle(ref, () => ({
    resetCharacterPosition,
  }));



  // Style pour la position animée du personnage
  const animatedStyle = {
    left: position.x,
    top: position.y,
  };

  return (
    <>
      <GameView
        handleTouch={handleTouch}
        animatedStyle={animatedStyle}
        imageSource={currentImage}
        world={world}
      />
      <CollisionHandler engine={engine.current} box={box} position={position} animationRef={animationRef} />
    </>
  );
});

export default Character1;
