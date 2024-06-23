// actions.js

// Définition des types d'action
export const SET_POSITION = 'SET_POSITION';
export const SET_COLLISION = 'SET_COLLISION';
export const SET_LAST_POSITION = 'SET_LAST_POSITION';
export const SET_IS_ANIMATING = 'SET_IS_ANIMATING';
export const SET_PLAYER_ID = 'SET_PLAYER_ID';
export const SET_ADDITION = 'SET_ADDITION';
export const SET_SHOW= 'SET_SHOW';
export const SET_RETOUR= 'SET_RETOUR';

/**
 * Crée une action pour définir l'ID du joueur.
 *
 * @param {string} id - L'ID du joueur.
 * @returns {object} Action de type SET_PLAYER_ID avec l'ID du joueur en payload.
 */
export const setPlayerId = (id) => ({
  type: SET_PLAYER_ID,
  payload: id,
});

/**
 * Crée une action pour définir la position.
 *
 * @param {object} position - La position à définir.
 * @returns {object} Action de type SET_POSITION avec la position.
 */
export const setPosition = (position) => ({
  type: SET_POSITION,
  position
});

export const setReturn = (ordre) => ({
  type: SET_RETOUR,
  payload: ordre,
  
});


/**
 * Crée une action pour définir l'état de collision.
 *
 * @param {boolean} isColliding - L'état de collision.
 * @returns {object} Action de type SET_COLLISION avec l'état de collision.
 */
export const setCollision = (isColliding) => ({
  type: SET_COLLISION,
  isColliding
});


export const setShow = (isShowing) => ({
  type: SET_SHOW,
  isShowing
});
/**
 * Crée une action pour définir la dernière position.
 *
 * @param {object} position - La dernière position.
 * @returns {object} Action de type SET_LAST_POSITION avec la dernière position.
 */
export const setLastPosition = (position) => ({
  type: SET_LAST_POSITION,
  position
});

/**
 * Crée une action pour définir l'état d'animation.
 *
 * @param {boolean} isAnimating - L'état d'animation.
 * @returns {object} Action de type SET_IS_ANIMATING avec l'état d'animation en payload.
 */
export const setIsAnimating = (isAnimating) => ({
  type: SET_IS_ANIMATING,
  payload: isAnimating,
});

/**
 * Crée une action pour définir l'état d'addition.
 *
 * @param {number} addition - L'état d'addition.
 * @returns {object} Action de type SET_ADDITION avec l'état d'addition en payload.
 */
export const setAddition = (addition) => ({
  type: SET_ADDITION,
  payload: addition,
});
