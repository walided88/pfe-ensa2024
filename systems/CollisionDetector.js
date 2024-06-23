import React, { useEffect } from 'react';
import Matter from 'matter-js';
import { useDispatch } from 'react-redux';
import { setCollision } from '../redux/actions';

/**
 * 
 * 
 * CollisionDetector - Composant pour détecter les collisions entre deux corps Matter.js
 * @param {Object} engine - L'engine Matter.js
 * @param {Object} bodyA - Le premier corps à surveiller
 * @param {Object} bodyB - Le deuxième corps à surveiller
 */
const CollisionDetector = ({ engine, bodyA, bodyB }) => {
  const dispatch = useDispatch(); // Hook pour dispatcher des actions Redux

  useEffect(() => {
    /**
     * handleCollisionStart - Fonction pour gérer le début des collisions
     * @param {Object} event - L'événement de collision
     */
    const handleCollisionStart = (event) => {
      const pairs = event.pairs; // Récupère les paires de corps en collision

      pairs.forEach((pair) => {
        // Vérifie si bodyA et bodyB sont en collision
        if ((pair.bodyA === bodyA && pair.bodyB === bodyB) || (pair.bodyA === bodyB && pair.bodyB === bodyA)) {
          dispatch(setCollision(true)); // Déclenche l'action setCollision avec true
        }
      });
    };

    /**
     * handleCollisionEnd - Fonction pour gérer la fin des collisions
     * @param {Object} event - L'événement de fin de collision
     */
    const handleCollisionEnd = (event) => {
      const pairs = event.pairs; // Récupère les paires de corps qui ne sont plus en collision

      pairs.forEach((pair) => {
        // Vérifie si bodyA et bodyB ne sont plus en collision
        if ((pair.bodyA === bodyA && pair.bodyB === bodyB) || (pair.bodyA === bodyB && pair.bodyB === bodyA)) {
          dispatch(setCollision(false)); // Déclenche l'action setCollision avec false
        }
      });
    };

    // Ajoute les écouteurs d'événements pour le début et la fin des collisions
    Matter.Events.on(engine, 'collisionStart', handleCollisionStart);
    Matter.Events.on(engine, 'collisionEnd', handleCollisionEnd);

    // Nettoie les écouteurs d'événements lorsqu'ils ne sont plus nécessaires
    return () => {
      Matter.Events.off(engine, 'collisionStart', handleCollisionStart);
      Matter.Events.off(engine, 'collisionEnd', handleCollisionEnd);
    };
  }, [engine, bodyA, bodyB, dispatch]); // Dépendances pour l'effet

  return null; // Ce composant ne rend rien
};

export default CollisionDetector;
