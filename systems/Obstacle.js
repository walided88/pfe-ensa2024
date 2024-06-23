import React from 'react';
import { View, Dimensions } from 'react-native';
import Matter from 'matter-js';

// Obtenir les dimensions de l'écran
const { width, height } = Dimensions.get('window');

/**
 * Obstacle
 * 
 * Ce composant représente un obstacle statique dans le monde Matter.js.
 * Il prend en charge la création et l'ajout de l'obstacle au monde Matter.js,
 * ainsi que son rendu dans l'interface utilisateur avec une transformation de rotation.
 *
 * @param {object} props - Les propriétés passées au composant.
 * @param {object} props.world - Le monde Matter.js.
 * @param {object} props.position - La position de l'obstacle.
 * @param {object} props.size - La taille de l'obstacle.
 * @param {string} props.color - La couleur de l'obstacle.
 * @param {number} props.angle - L'angle de rotation de l'obstacle en radians.
 */
const Obstacle = ({ world, position, size, color, angle }) => {
  // Créer le corps de l'obstacle avec Matter.js
  const obstacle = Matter.Bodies.rectangle(
    position.x, 
    position.y, 
    size.width, 
    size.height, 
    { isStatic: true, angle }
  );

  // Ajouter l'obstacle au monde Matter.js
  Matter.World.add(world, [obstacle]);

  return (
    // Vue représentant l'obstacle dans l'interface utilisateur
    <View
      style={{
        position: 'absolute',
        left: position.x - size.width / 2,
        top: position.y - size.height / 2,
        width: size.width,
        height: size.height,
        backgroundColor: color,
        transform: [{ rotate: `${angle}rad` }],
      }}
    />
  );
};

export default Obstacle;
