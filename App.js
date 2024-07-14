import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './store/store';
import { openDatabase, createTable } from './services/Database';
import Orientation from 'react-native-orientation-locker';
import { StatusBar } from 'react-native';
import './i18n';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import Game3Screen from './screens/Game3Screen';
import Game4Screen from './screens/Game4Screen';

import Game2Screen from './screens/Game2Screen';
import ResultsScreen from './screens/ResultsScreen';
import ListScreen from './screens/ListScreen';
import GeminiHelper from './components/GeminiHelper';
import GameView from './screens/GameView'; // Assurez-vous que le chemin est correct
import { Provider } from 'react-redux';

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
          <Stack.Screen name="ComponentList" component={ListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Game4" component={Game4Screen} options={{ headerShown: false }} />

          <Stack.Screen name="Game3" component={Game3Screen} options={{ headerShown: false }} />
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
