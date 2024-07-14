import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import FastImage from 'react-native-fast-image';
import BgMusic from "../components/BgMusique";

import { useTranslation } from 'react-i18next';
import 'intl';
import 'intl/locale-data/jsonp/en'; // Ajoutez d'autres langues si nécessaire

/**
 * ComponentListScreen
 *
 * Ce composant affiche une liste de boutons qui permettent de naviguer vers différents écrans de jeu.
 * Chaque bouton représente un type de jeu différent. Un bouton "EXIT" permet de quitter l'application.
 * Une musique de fond est également jouée lorsqu'on est sur cet écran.
 *
 * @param {object} navigation - L'objet de navigation fourni par React Navigation.
 */
const ComponentListScreen = React.memo(({ navigation }) => {

  // Fonctions de navigation vers différents écrans
  const navigateToGame = useCallback(() => navigation.navigate('Game'), [navigation]);
  const navigateToHome = useCallback(() => navigation.navigate('Home'), [navigation]);
  const navigateToResults = useCallback(() => navigation.navigate('Results'), [navigation]);
  const navigateToGame4 = useCallback(() => navigation.navigate('Game4'), [navigation]);
  const navigateToGame3 = useCallback(() => navigation.navigate('Game3'), [navigation]);

  const navigateToGame2 = useCallback(() => navigation.navigate('Game2'), [navigation]);
  const { t } = useTranslation();

  // Fonction pour quitter l'application
  const handleExitApp = useCallback(() => {
    BackHandler.exitApp();
  }, []);

  return (
    <FastImage
      source={require('../assets/images/kitchen1.webp')}
      style={styles.background}
      resizeMode={FastImage.resizeMode.cover}
    >
      <View style={styles.container}>
        {/* Musique de fond */}
        <BgMusic musicFile="bg1.mp3" volume={0.9} />

        {/* Boutons de navigation */}
        <TouchableOpacity
          style={[styles.button, styles.buttonAddition]}
          onPress={navigateToGame}
        >
          <Text style={styles.buttonText}> {t('ADDITION GAME')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSubtraction]}
          onPress={navigateToGame3}
        >
          <Text style={styles.buttonText}> {t('SUBSTRUCTION GAME')} </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonMultiplication]}
          onPress={navigateToGame2}
        >
          <Text style={styles.buttonText}>{t('MULTIPLICATION GAME')} </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonDivision]}
          onPress={navigateToGame4}
        >
          <Text style={styles.buttonText}>{t('DIVISION GAME')}  </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonResults]}
          onPress={navigateToResults}
        >
          <Text style={styles.buttonText}>{t('RESULT SCREEN')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonExit]}
          onPress={navigateToHome}
        >
          <Text style={styles.buttonText}>{t('EXIT')} </Text>
        </TouchableOpacity>
      </View>
    </FastImage>
  );
});

export default ComponentListScreen;

// Styles pour le composant
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Comic Sans MS',
    color: '#FFF',
  },
  button: {
    padding: 6,
    borderRadius: 33,
    marginVertical: 10,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonAddition: {
    backgroundColor: 'red',
  },
  buttonSubtraction: {
    backgroundColor: 'blue',
  },
  buttonMultiplication: {
    backgroundColor: 'green',
  },
  buttonDivision: {
    backgroundColor: 'purple',
  },
  buttonResults: {
    backgroundColor: 'orange',
    padding: 20,
  },
  buttonExit: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'black',
    padding: 22,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Times New Roman',
  },
});
