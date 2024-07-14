import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getPlayerById} from '../services/Database'; // Assurez-vous d'importer correctement
import FastImage from 'react-native-fast-image';
import BgMusic from "../components/BgMusique";

import { useTranslation } from 'react-i18next';
import 'intl';
import 'intl/locale-data/jsonp/en'; // Ajoutez d'autres langues si nécessaire

const ResultsScreen = ({ navigation }) => {
  const playerId = useSelector((state) => state.playerId);
  const [player, setPlayer] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
   
      console.log("Fetching player with ID:", playerId);
      getPlayerById(playerId, (data) => {
        console.log("Player data:", data);
        setPlayer(data);
      });
    
  }, [playerId]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleExit = useCallback(() => {
    navigation.navigate('ComponentList');
  }, [navigation]);

  if (!player) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Limiter les scores à un maximum de 10
  ['score_addition', 'score_subtraction', 'score_division', 'score_multiplication'].forEach(score => {
    if (player[score] > 10) {
      player[score] = 10;
    }
  });

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
          <Text style={styles.buttonText}>{t('Back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('Results Screen')}</Text>
        <View style={styles.player}>
          <Text style={styles.playerText}>{t('Name')}: {player.name}</Text>
          <Text style={styles.scoreText}>🎉 {t('Addition Score')}: {player.score_addition}/10</Text>
          <Text style={styles.scoreText}>🎉 {t('Subtraction Score')}: {player.score_subtraction}/10</Text>
          <Text style={styles.scoreText}>🎉 {t('Multiplication Score')}: {player.score_multiplication}/10</Text>
          <Text style={styles.scoreText}>🎉 {t('Division Score')}: {player.score_division}/10</Text>
        </View>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleExit}
        >
          <Text style={styles.buttonText}>{t('HOME')}</Text>
        </TouchableOpacity>
      </View>
    </FastImage>
  );
};

export default ResultsScreen;

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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
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
