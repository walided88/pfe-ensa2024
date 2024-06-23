// reducers.js

import { combineReducers } from 'redux';
import { SET_POSITION,SET_SHOW,SET_RETOUR, SET_COLLISION, SET_LAST_POSITION, SET_IS_ANIMATING, SET_PLAYER_ID, SET_ADDITION } from './actions';

/**
 * Reducer pour gérer la position.
 *
 * @param {object} state - L'état initial de la position.
 * @param {object} action - L'action envoyée.
 * @returns {object} Le nouvel état de la position.
 */



const initialState = {
  // Define your initial state here
  retour: null
};





const positionReducer = (state = { x: 200, y: 333 }, action) => {
  switch (action.type) {
    case SET_POSITION:
      return action.position;
    default:
      return state;
  }
};


const retourReducer = (state = 2, action) => {
  switch (action.type) {
    case 'SET_RETOUR':
      // Handle the SET_RETOUR action
      return action.payload;
      default:
        return state;
    }
  };
  


/**
 * Reducer pour gérer l'état de collision.
 *
 * @param {boolean} state - L'état initial de collision.
 * @param {object} action - L'action envoyée.
 * @returns {boolean} Le nouvel état de collision.
 */
const collisionReducer = (state = false, action) => {
  switch (action.type) {
    case SET_COLLISION:
      return action.isColliding;
    default:
      return state;
  }
};
const showReducer = (state = false, action) => {
  switch (action.type) {
    case SET_SHOW:
      return action.isShowing;
    default:
      return state;
  }
};
/**
 * Reducer pour gérer la dernière position.
 *
 * @param {object} state - L'état initial de la dernière position.
 * @param {object} action - L'action envoyée.
 * @returns {object} Le nouvel état de la dernière position.
 */
const lastPositionReducer = (state = { x: 200, y: 333 }, action) => {
  switch (action.type) {
    case SET_LAST_POSITION:
      return action.position;
    default:
      return state;
  }
};

/**
 * Reducer pour gérer l'état d'animation.
 *
 * @param {boolean} state - L'état initial d'animation.
 * @param {object} action - L'action envoyée.
 * @returns {boolean} Le nouvel état d'animation.
 */
const animatingReducer = (state = false, action) => {
  switch (action.type) {
    case SET_IS_ANIMATING:
      return action.payload;
    default:
      return state;
  }
};

/**
 * Reducer pour gérer l'ID du joueur.
 *
 * @param {string|null} state - L'état initial de l'ID du joueur.
 * @param {object} action - L'action envoyée.
 * @returns {string|null} Le nouvel ID du joueur.
 */
const playerIdReducer = (state = null, action) => {
  switch (action.type) {
    case SET_PLAYER_ID:
      return action.payload;
    default:
      return state;
  }
};

/**
 * Reducer pour gérer l'état d'addition.
 *
 * @param {number} state - L'état initial d'addition.
 * @param {object} action - L'action envoyée.
 * @returns {number} Le nouvel état d'addition.
 */
const additionReducer = (state = 2, action) => {
  switch (action.type) {
    case SET_ADDITION:
      return action.payload;
    default:
      return state;
  }
};

/**
 * Combine tous les reducers en un seul reducer principal.
 *
 * @returns {object} Le reducer principal combiné.
 */
const rootReducer = combineReducers({
  position: positionReducer,
  isColliding: collisionReducer,
  lastPosition: lastPositionReducer,
  isAnimating: animatingReducer,
  playerId: playerIdReducer,
  addition: additionReducer,
  isShowing:showReducer,
  retour:retourReducer,
});

export default rootReducer;
