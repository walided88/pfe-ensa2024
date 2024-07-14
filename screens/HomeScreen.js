import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPlayer, getPlayers, checkPlayerExists,getPlayerByName } from '../services/Database';
import { setPlayerId } from '../store/actions';
import BgMusique from "../components/BgMusique";
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Picker } from '@react-native-picker/picker';

/**
 * Composant HomeScreen
 * 
 * Le composant HomeScreen est l'écran d'accueil de l'application où les utilisateurs peuvent entrer leur nom et sélectionner une langue.
 * Il comporte des éléments animés et s'intègre avec un store Redux pour gérer les données des joueurs.
 */

const HomeScreen = React.memo(({ navigation }) => {
  // État pour stocker la liste des joueurs
  const [players, setPlayers] = useState([]);
  // État pour stocker le nom entré
  const [name, setName] = useState('');
  // État pour stocker le message de bienvenue pour l'utilisateur
  const [welcomeMessage, setWelcomeMessage] = useState('');
  // Hook de dispatch Redux
  const dispatch = useDispatch();
  // Hook de traduction
  const { t, i18n } = useTranslation();

  // Référence pour gérer la valeur de l'animation
  const animatedValue = useRef(new Animated.Value(1)).current;
  // Référence pour gérer l'opacité du message de bienvenue
  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  // Fonction pour changer la langue avec i18n
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Hook pour récupérer la liste des joueurs et démarrer la boucle d'animation lors du montage du composant
  useEffect(() => {
    getPlayers(setPlayers);

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  // Fonction asynchrone pour gérer l'ajout d'un joueur et la navigation vers l'écran suivant
  const handleAddPlayerAndNavigate = useCallback(async () => {
    if (name) {
      
      try {





        checkPlayerExists(name)
        .then(({ exists, playerId }) => {
          if (exists) {
            setWelcomeMessage(`${t('welcome back')}, ${name}!`);
            dispatch(setPlayerId(playerId));

            console.log(`Player found with ID: ${playerId}`);
            // Continuez avec la logique de votre application
          } else {
            addPlayer(name, (playerId) => {
              dispatch(setPlayerId(playerId));
              setWelcomeMessage(`${t('welcome')}, ${name}!`);
            });

            console.log('Player not found',playerId);
          }
          dispatch(setPlayerId(playerId));

        })
        .catch(error => {
          console.log('Error checking player existence:', error);
        });
      

        setName('');

        // Animation pour afficher puis masquer le message de bienvenue
        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(welcomeOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              setWelcomeMessage('');
              navigation.navigate('ComponentList');
            });
          }, 2000);
        });
      } catch (error) {
        console.error("Erreur lors de la vérification de l'existence du joueur ou de l'ajout du joueur:", error);
      }
    }
  }, [name, dispatch, welcomeOpacity, navigation]);

  return (
    <FastImage
      source={require('../assets/images/math.gif')}
      style={styles.background}
      resizeMode={FastImage.resizeMode.cover}
    >
      <View style={styles.languagePickerContainer}>
        <Picker
          selectedValue={i18n.language}
          style={styles.languagePicker}
          onValueChange={(itemValue) => changeLanguage(itemValue)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Français" value="fr" />
        </Picker>
      </View>
      <View style={styles.container}>
        <BgMusique musicFile="bg.mp3" volume={0.7} />
        <TextInput
          style={styles.input}
          placeholder={t('Enter your name')}
          value={name}
          onChangeText={setName}
        />
        <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleAddPlayerAndNavigate}
          >
            <Text style={styles.buttonText}>{t('Add a name')}</Text>
          </TouchableOpacity>
        </Animated.View>
        {welcomeMessage !== '' && (
          <Animated.View style={[styles.welcomeMessage, { opacity: welcomeOpacity }]}>
            <Text style={styles.welcomeText}>{welcomeMessage}</Text>
          </Animated.View>
        )}
      </View>
    </FastImage>
  );
});


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  languagePickerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  languagePicker: {
    height: 40,
    width: '25%',
    backgroundColor: 'orange',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '25%',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
  },
  buttonContainer: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
  },
  welcomeMessage: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Comic Sans MS',
    color: '#FF4500',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});
export default HomeScreen;
