import React, { useEffect, useRef } from 'react';
import Sound from 'react-native-sound';
import { useSelector } from 'react-redux';

/**
 * MusicPlayer Component
 * 
 * Ce composant joue un fichier audio lorsque l'état d'animation est actif
 * et arrête la lecture lorsque l'animation est terminée.
 *
 * @param {string} file - Le nom du fichier audio à jouer.
 * @param {number} volume - Le volume de la musique (valeur par défaut : 1.0).
 */
const MusicPlayer = ({ file, volume = 1.0 }) => {
  const isAnimating = useSelector((state) => state.isAnimating); // État d'animation du Redux store
  const soundRef = useRef(null); // Référence pour l'objet Sound

  // Effet pour jouer/arrêter la musique en fonction de l'état d'animation
  useEffect(() => {
    if (isAnimating) {
      // Configurer la catégorie du son pour la lecture
      Sound.setCategory('Playback');
      
      // Charger et jouer le son
      soundRef.current = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        
        // Configurer le volume et jouer le son
        soundRef.current.setVolume(volume);
        soundRef.current.play((success) => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      });
    } else {
      // Arrêter et libérer le son si l'animation est arrêtée
      if (soundRef.current) {
        soundRef.current.stop(() => {
          console.log('Sound stopped');
        });
        soundRef.current.release();
      }
    }

    // Nettoyage à la fin de l'effet
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, [isAnimating, file, volume]);

  return null; // Ce composant n'a pas de rendu visuel
};

export default MusicPlayer;
