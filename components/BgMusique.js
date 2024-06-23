import React, { useEffect, useRef, useCallback } from 'react';
import Sound from 'react-native-sound';
import { useFocusEffect } from '@react-navigation/native';

/**
 * BgMusique Component
 * 
 * Ce composant est responsable de la lecture de la musique de fond lorsqu'un écran est focalisé
 * et de l'arrêt de la musique lorsqu'il est défocalisé. Utilise la bibliothèque `react-native-sound`
 * pour gérer la lecture audio.
 *
 * @param {string} musicFile - Le nom du fichier de musique à jouer.
 * @param {number} volume - Le volume de la musique (valeur entre 0 et 1).
 */
const BgMusique = ({ musicFile, volume }) => {
  const soundRef = useRef(null);

  // Utiliser useFocusEffect pour gérer la musique en fonction de la focalisation de l'écran
  useFocusEffect(
    useCallback(() => {
      // Charger et jouer la musique lorsque l'écran est focalisé
      soundRef.current = new Sound(musicFile, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        // Configurer le volume et la boucle infinie
        soundRef.current.setVolume(volume);
        soundRef.current.setNumberOfLoops(-1);
        // Jouer la musique
        soundRef.current.play((success) => {
          if (!success) {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      });

      // Arrêter et libérer la musique lorsque l'écran est défocalisé
      return () => {
        if (soundRef.current) {
          soundRef.current.stop(() => {
            soundRef.current.release();
          });
        }
      };
    }, [musicFile, volume])
  );

  return null; // Ce composant n'a pas de rendu visuel
};

export default BgMusique;
