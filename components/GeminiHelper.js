import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Dimensions, TextInput, StyleSheet, ScrollView, ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native';
import { startChat } from '../services/geminiService';
import { useDispatch, useSelector } from 'react-redux';
import { setShow, setReturn } from '../store/actions';
import FastImage from 'react-native-fast-image';
import BgMusic from "../components/BgMusique";

const { width, height } = Dimensions.get('window');

const GeminiHelper = ({ onClose, navigation }) => {
  const [userInput, setUserInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isShow = useSelector((state) => state.isShowing);
  const dispatch = useDispatch();
  const navigateToGame = useCallback(() => navigation.navigate('Game'), [navigation]);
  const navigateToGame2 = useCallback(() => navigation.navigate('Game2'), [navigation]);
  const navigateToGame3 = useCallback(() => navigation.navigate('Game3'), [navigation]);
  const navigateToGame4 = useCallback(() => navigation.navigate('Game4'), [navigation]);

  const retourX = useSelector((state) => state.retour);

  // Fonction pour démarrer le chat avec Google Generative AI
  const handleStartChat = async () => {
    if (userInput.trim() === '') {
      setChatResponse('Please enter a message.'); // Vérification de l'entrée utilisateur vide
      return;
    }
    setIsLoading(true); // Début du chargement
    setChatResponse(''); // Effacement de la réponse précédente
    const response = await startChat(userInput); // Appel de la fonction startChat pour obtenir la réponse
    setChatResponse(response); // Mise à jour de la réponse dans l'état
    setIsLoading(false); // Fin du chargement
  };
  console.log('retourX QQQQQQQ',retourX);

  const handlePress = () => {
    switch (retourX) {
      case 1:
        navigateToGame();
        console.log('Case 1 action');
        break;
      case 2:
        navigateToGame2();
        console.log('cas 2 ');
        break;
      case 3:
        navigateToGame3();
        console.log('cas 3 ');
        break;
      case 4:
        navigateToGame4();
        console.log('cas 4 ');
        break;
      default:
        console.log('pas de cas ');
    }
  };
  
  // Effet pour gérer la visibilité de l'écran en fonction de l'état "isShow" du store Redux

  useEffect(() => {
    if (navigateToGame ||navigateToGame2 ||navigateToGame3 ||navigateToGame4 ) {
      dispatch(setShow(false));
    }
  }, [isShow, navigateToGame]);

  return (
    <FastImage
      source={require('../assets/images/library.gif')}
      style={styles.background}
      resizeMode={FastImage.resizeMode.cover}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {(!isLoading && chatResponse.trim() !== '') ? (
          <FastImage
            source={require('../assets/images/botResp.png')}
            style={styles.newBackground}
          />
        ) : (
          <FastImage
            source={require('../assets/images/botRecp.gif')}
            style={styles.newBackground}
          />
        )}
        <View style={styles.chatResponseContainer}>
          <ScrollView contentContainerStyle={styles.chatResponseScroll}>
            {!isLoading && chatResponse.trim() !== '' && (
              <Text style={styles.chatResponse}>{chatResponse}</Text>
            )}
          </ScrollView>
          {isLoading && <ActivityIndicator size={60} color="#0000ff" />}

        </View>
        <TextInput
          style={styles.input}
          placeholder="Ask something..."
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={handleStartChat} // This triggers when the "Enter" key is pressed
        />
        <TouchableOpacity onPress={handlePress} style={styles.closeButtonContainer}>
          <FastImage
            source={require('../assets/images/close.png')}
            style={styles.closeButton}
          />
        </TouchableOpacity>
      </ScrollView>
      <BgMusic musicFile="bg7.mp3" volume={2} />

    </FastImage>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    elevation: 22,

  },
  input: {
    fontSize: 33,
    textAlign: 'center',
    top: height * 0.06,
    right: width * 0.2,
    borderColor: 'grey',
    borderWidth: 3,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with 50% transparency
    width: width * 0.3,
    height: height * 0.4,
    borderRadius: 222,
    position: 'absolute',
    elevation: 222,

  },
  chatResponseContainer: {
    top: -height * 0.95,
    right: width * 0.3,
    width: width * 0.4,
    borderColor: 'black',
    borderWidth: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White with 50% transparency
    borderRadius: 11,
    padding: 10,
    elevation: 222,

  },
  chatResponseScroll: {
    flexGrow: 1,
  },
  chatResponse: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Comic Sans MS',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButton: {
    width: 50,
    height: 50,
  },
  newBackground: {
    width: width * 0.6,
    height: height * 0.9,
    marginTop: 20,
    top: height * 0.08,
    right: -width * 0.35,

  },
});

export default GeminiHelper;
