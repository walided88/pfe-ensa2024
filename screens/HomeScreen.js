import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPlayer, getPlayers, checkPlayerExists } from '../services/Database';
import { setPlayerId } from '../redux/actions';
import BgMusique from "../components/BgMusique";
import CollisionHandler from '../systems/CollisionHandler';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Picker } from '@react-native-picker/picker';
import '../i18n';
import 'intl';
import 'intl/locale-data/jsonp/en'; // Ajoutez d'autres langues si nécessaire
import store from '../redux/store';
import { Provider } from 'react-redux';

const HomeScreen = React.memo(({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const dispatch = useDispatch();
  const playerId = useSelector((state) => state.playerId);
  const { t, i18n } = useTranslation();

  const animatedValue = useRef(new Animated.Value(1)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.languageButton} onPress={() => changeLanguage(item.value)}>
      <Text style={styles.languageText}>{item.label}</Text>
    </TouchableOpacity>
  );
  CollisionHandler
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

  const handleAddPlayerAndNavigate = useCallback(async () => {
    if (name) {
      try {
        const exists = await checkPlayerExists(name);
        if (exists) {
          setWelcomeMessage(`Welcome back, ${name}!`);
        } else {
          addPlayer(name, (playerId) => {
            dispatch(setPlayerId(playerId));
            setWelcomeMessage(t('welcome') );
          });
        }

        getPlayers(setPlayers);
        setName('');

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
        console.error("Error checking player existence or adding player:", error);
      }
    }
  }, [name, dispatch, welcomeOpacity, navigation]);

  return (

    
    <FastImage
    source={require('../assets/images/math.gif')}
    style={styles.background}
    resizeMode={FastImage.resizeMode.cover}
  >

      <Provider store={store}>

<View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Picker
            selectedValue={i18n.language}
            style={{ height: 50, width: 150 ,    backgroundColor: 'orange',
            }}
            onValueChange={(itemValue) => changeLanguage(itemValue)}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Français" value="fr" />
          </Picker>
        </View>
        </Provider>
      <View style={styles.container}>
      <Text>{t('welcome')}</Text>

        <BgMusique musicFile="bg.mp3" volume={0.7} /> 
        <TextInput
          style={styles.input}
          placeholder="   Enter your name"
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

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
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
    shadowRadius: 2,
    elevation: 5,
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
