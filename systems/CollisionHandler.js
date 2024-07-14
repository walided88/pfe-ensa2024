import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useDispatch, useSelector } from 'react-redux';
import { setCollision, setLastPosition, setIsAnimating } from '../store/actions';

/**
 * CollisionHandler
 * 
 * Ce composant gère les collisions du corps du personnage avec d'autres objets dans le moteur Matter.js.
 * Lorsqu'une collision est détectée, il met à jour l'état Redux pour indiquer une collision, arrête toute animation
 * en cours et applique une force de répulsion pour simuler l'effet de la collision.
 *
 * @param {object} props - Les propriétés passées au composant.
 * @param {object} props.engine - Le moteur Matter.js.
 * @param {object} props.box - Le corps du personnage.
 * @param {object} props.position - La position animée du personnage.
 */
const CollisionHandler = ({ engine, box, position }) => {
  const dispatch = useDispatch();
  const animationRef = useRef(null);
  const isColliding = useSelector((state) => state.isColliding);
  const isCollidingRef = useRef(isColliding);
  // const debounceRef = useRef(false);

  // Met à jour la référence isCollidingRef lorsque isColliding change.
  useEffect(() => {
    isCollidingRef.current = isColliding;
  }, [isColliding]);

  useEffect(() => {
    /**
     * Gère les collisions en appliquant une force de répulsion.
     *
     * @param {object} event - L'événement de collision de Matter.js.
     */
    const handleCollision = (event) => {
      const pairs = event.pairs;
      pairs.forEach(pair => {
        if (pair.bodyA === box || pair.bodyB === box) {
          const otherBody = pair.bodyA === box ? pair.bodyB : pair.bodyA;
          if (otherBody.isStatic) {
            setTimeout(() => {
            }, 10); // Prévenir les déclenchements rapides multiples


            if (!isCollidingRef.current) {
              dispatch(setCollision(true));

              // Arrête toute animation en cours.
              if (animationRef.current) {
                animationRef.current.stop();
                animationRef.current = null;
              }

              // Applique une force de répulsion due à la collision.
              const collisionPoint = pair.collision.supports[0]; //pair.collision.supports: les points sur les surfaces des deux objets qui sont en contact lors de la collision.
              const forceMagnitude = 5;
              const forceDirection = Matter.Vector.normalise(Matter.Vector.sub(box.position, collisionPoint));
              const force = Matter.Vector.mult(forceDirection, forceMagnitude);

              Matter.Body.applyForce(box, box.position, force);
              const newPosition = Matter.Vector.add(box.position, force);
              position.setValue(newPosition);
              console.log("collision !!!!");

              setTimeout(() => {
                dispatch(setCollision(false));
                dispatch(setIsAnimating(false));
              }, 10);
            }
          }
        }
      });
    };

    // Ajoute un écouteur d'événement pour les collisions.
    Matter.Events.on(engine, 'collisionStart', handleCollision);

    // Nettoyage à la désactivation du composant.
    return () => {
      Matter.Events.off(engine, 'collisionStart', handleCollision);
    };
  }, [dispatch, engine, box, position]);

  return null;
};

export default CollisionHandler;
