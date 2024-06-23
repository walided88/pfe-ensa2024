import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Matter from 'matter-js';
import { setPosition, setCollision, setLastPosition, setIsAnimating, setAddition } from '../redux/actions';
import GameView from '../view/GameView';
import { incrementScoreAddition } from '../services/Database';
import CollisionHandler from '../systems/CollisionHandler';

const { width, height } = Dimensions.get('window');

/**
 * Composant Game
 * 
 * Ce composant gère l'affichage et la logique du jeu, y compris l'animation du personnage, la gestion des collisions,
 * et l'interaction avec les états Redux.
 * 
 * @param {object} props - Les propriétés passées au composant.
 * @param {object} ref - Référence pour accéder aux fonctions internes depuis l'extérieur.
 */
const Game = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const position = useRef(new Animated.ValueXY({ x: 200, y: 200 })).current; // Position animée du personnage
  const animationRef = useRef(null); // Référence pour l'animation en cours
  const engine = useRef(Matter.Engine.create()); // Création de l'engine Matter.js
  const { world } = engine.current; // Récupération du monde de l'engine
  const [currentImage, setCurrentImage] = useState(require('../assets/images/characterLeft.gif')); // Image actuelle du personnage
  const [lastDirection, setLastDirection] = useState('left'); // Dernière direction du personnage

  const box = useRef(Matter.Bodies.rectangle(400, 400, 50, 50, { isStatic: false })).current; // Création du corps du personnage

  const isColliding = useSelector((state) => state.isColliding); // État de collision
  const isAnimating = useSelector((state) => state.isAnimating); // État d'animation
  const playerId = useSelector((state) => state.playerId); // ID du joueur
  const add = useSelector((state) => state.addition); // État d'addition

  engine.current.gravity.y = 0; // Désactivation de la gravité

  // Effet pour ajouter le corps au monde et mettre à jour sa position
  useEffect(() => {
    Matter.World.add(world, [box]);

    const update = () => {
      const { x, y } = position.__getValue();
      Matter.Body.setPosition(box, { x, y });
      Matter.Engine.update(engine.current, 1000 / 60);
      requestAnimationFrame(update);
    };

    update();

    // Nettoyage de l'engine et du monde lorsque le composant est démonté
    return () => {
      Matter.World.remove(world, box);
      Matter.Engine.clear(engine.current);
    };
  }, [position, world]);

  // Fonction pour déplacer le personnage à une nouvelle position
  const moveBoxToPosition = useCallback((x, y) => {
    if (animationRef.current) {
      animationRef.current.stop(); // Arrêter l'animation en cours
    }

    dispatch(setIsAnimating(true)); // Définir l'état d'animation à vrai

    const currentPos = position.__getValue();

    // Mise à jour de l'image et de la direction en fonction de la nouvelle position
    if (x < currentPos.x) {
      setCurrentImage(require('../assets/images/chefleft.webp'));
      setLastDirection('left');
    } else if (x > currentPos.x) {
      setCurrentImage(require('../assets/images/chefright.webp'));
      setLastDirection('right');
    }

    // Démarrer l'animation de déplacement si aucune collision n'est détectée
    if (!isColliding) {
      animationRef.current = Animated.timing(position, {
        toValue: { x, y },
        duration: 1500,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          dispatch(setPosition({ x, y }));
          dispatch(setIsAnimating(false));
          dispatch(setCollision(false));
          animationRef.current = null;
        }
      });
    } else {
      dispatch(setCollision(false));
      dispatch(setIsAnimating(false));
    }
  }, [dispatch, isColliding, position]);

  // Effet pour mettre à jour l'image en fonction de l'état d'animation et de la dernière direction
  useEffect(() => {
    if (!isAnimating) {
      switch (lastDirection) {
        case 'left':
          setCurrentImage(require('../assets/images/chefleft.webp'));
          break;
        case 'right':
          setCurrentImage(require('../assets/images/chefright.webp'));
          break;
      }
    }
  }, [isAnimating, lastDirection]);

  // Gestion du toucher pour déplacer le personnage
  const handleTouch = useCallback((event) => {
    const { pageX, pageY } = event.nativeEvent;
    moveBoxToPosition(pageX - 25, pageY - 100); // Déplacer le personnage à la position touchée
    dispatch(setLastPosition({ x: pageX, y: pageY }));

    const currentPosition = position.__getValue();
    console.log("Current position after touch:", currentPosition);
  }, [dispatch, moveBoxToPosition, position]);

  // Fonction pour réinitialiser la position du personnage
  const resetCharacterPosition = (x, y) => {
    position.setValue({ x, y });
    Matter.Body.setPosition(box, { x, y });
    dispatch(setPosition({ x, y }));
  };

  // Utilisation de useImperativeHandle pour exposer certaines méthodes à l'extérieur
  useImperativeHandle(ref, () => ({
    resetCharacterPosition,
  }));

  // Style animé pour la position du personnage
  const animatedStyle = {
    left: position.x,
    top: position.y,
  };

  return (
    <>
      <GameView
        box={box}
        handleTouch={handleTouch}
        animatedStyle={animatedStyle}
        imageSource={currentImage}
        world={world}
      />
      <CollisionHandler engine={engine.current} box={box} position={position} animationRef={animationRef} />
    </>
  );
});

export default Game;
