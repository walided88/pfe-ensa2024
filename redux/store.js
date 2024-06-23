// store.js

import { createStore } from 'redux';
import rootReducer from './reducers';

/**
 * Création du store Redux.
 * 
 * Le store est créé en utilisant le reducer principal combiné (rootReducer).
 * Le store contient l'état global de l'application et permet de gérer les actions 
 * et les mises à jour de l'état de manière centralisée.
 *
 * @returns {object} Le store Redux.
 */
const store = createStore(rootReducer);

export default store;
