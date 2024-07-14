/**
 * @format
 */
import 'intl';
import 'intl/locale-data/jsonp/en'; // Ajoutez d'autres langues si nécessaire
import 'intl-pluralrules';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Sound from 'react-native-sound';

/**
 * Enregistre le composant principal de l'application.
 * 
 * Cette ligne indique à React Native de démarrer l'application avec le composant `App`.
 * `appName` est le nom de l'application défini dans `app.json`.
 */
AppRegistry.registerComponent(appName, () => App);
