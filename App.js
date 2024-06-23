import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './redux/store';
import { openDatabase, createTable } from './services/Database';
import Orientation from 'react-native-orientation-locker';
import { StatusBar } from 'react-native';
import './i18n';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import Game2Screen from './screens/Game2Screen';
import ResultsScreen from './screens/ResultsScreen';
import ComponentListScreen from './screens/ComponentListScreen';
import GeminiHelper from './components/GeminiHelper';
import GameView from './view/GameView'; // Assurez-vous que le chemin est correct
import { SafeAreaView, Text, Button, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    openDatabase();
    createTable();

 
  }, []);
  useEffect(() => {
    // Cacher la barre d'état
    StatusBar.setHidden(true);
    // Verrouiller l'orientation en paysage
    Orientation.lockToLandscape();

    return () => {
      // Réinitialiser l'orientation par défaut lors du démontage du composant
      Orientation.unlockAllOrientations();
    };
  }, []);
  return (
    <Provider store={store}>
          
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">


          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ComponentList" component={ComponentListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Game2" component={Game2Screen} options={{ headerShown: false }} />
          <Stack.Screen name="Gemini" component={GeminiHelper} options={{ headerShown: false }} />
          <Stack.Screen name="GameView" component={GameView} options={{ headerShown: false }} />
          <Stack.Screen name="Results" component={ResultsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>

    </Provider>
  );
};

export default App;
