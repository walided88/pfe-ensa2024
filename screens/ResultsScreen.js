import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getPlayerById } from '../services/Database'; // Assurez-vous d'importer correctement
import FastImage from 'react-native-fast-image';
import BgMusic from "../components/BgMusique";

/**
 * ResultsScreen
 * 
 * Ce composant affiche les résultats du joueur, y compris les scores pour différentes opérations arithmétiques.
 * Il permet également à l'utilisateur de revenir à l'écran précédent ou d'aller à l'écran d'accueil.
 *
 * @param {object} navigation - L'objet de navigation fourni par React Navigation.
 */
const ResultsScreen = React.memo(({ navigation }) => {
  const playerId = useSelector((state) => state.playerId);
  const [player, setPlayer] = useState(null);

  // Effet pour récupérer les données du joueur à partir de la base de données en utilisant l'ID du joueur
  useEffect(() => {
    if (playerId) {
      console.log("Fetching player with ID:", playerId);
      getPlayerById(playerId, (data) => {
        console.log("Player data:", data);
        setPlayer(data);
      });
    }
  }, [playerId]);

  // Fonction pour revenir à l'écran précédent
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Fonction pour aller à l'écran d'accueil
  const handleExit = useCallback(() => {
    navigation.navigate('ComponentList');
  }, [navigation]);

  if (!player) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    if (player.score_addition > 10) {
      player.score_addition = 10;
    }
  }

  return (
    <FastImage
      source={require('../assets/images/bg3.gif')}
      style={styles.background}
      resizeMode={FastImage.resizeMode.cover}
    >
      <View style={styles.container}>
        <BgMusic musicFile="bg1.mp3" volume={0.7} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Results Screen</Text>
        <View style={styles.player}>
          <Text style={styles.playerText}>Name: {player.name}</Text>
          <Text style={styles.scoreText}>🎉 Addition Score: {player.score_addition}/10</Text>
          <Text style={styles.scoreText}>🎉 Subtraction Score: {player.score_subtraction}/10</Text>
          <Text style={styles.scoreText}>🎉 Multiplication Score: {player.score_multiplication}/10</Text>
          <Text style={styles.scoreText}>🎉 Division Score: {player.score_division}/10</Text>
        </View>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleExit}
        >
          <Text style={styles.buttonText}>HOME</Text>
        </TouchableOpacity>
      </View>
    </FastImage>
  );
});

export default ResultsScreen;

// Styles pour le composant
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  homeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#004BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Comic Sans MS',
    color: '#FF4500',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    marginBottom: 20,
  },
  player: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fond semi-transparent
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center', // Centrer le texte horizontalement
    justifyContent: 'center', // Centrer le texte verticalement
    width: '80%',
  },
  playerText: {
    fontSize: 24,
    fontFamily: 'Comic Sans MS',
    color: '#000',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'Comic Sans MS',
    color: '#FF4500',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 10,
  },
});
