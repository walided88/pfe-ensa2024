
import { getScoreById, updateScore } from '../services/Database';

/**
 * Incrémente le score du joueur.
 *
 * @param {string} playerId - L'ID du joueur.
 * @param {number} currentScore - Le score actuel du joueur.
 * @param {function} setScoreCallback - Callback pour mettre à jour le score dans l'état.
 */
export const handleIncrement = (playerId, currentScore, setScoreCallback) => {
  const newScore = currentScore + 1;
  setScoreCallback(newScore);
  updateScore(playerId, 'score_addition', newScore);
};

/**
 * Décrémente le score du joueur.
 *
 * @param {string} playerId - L'ID du joueur.
 * @param {number} currentScore - Le score actuel du joueur.
 * @param {function} setScoreCallback - Callback pour mettre à jour le score dans l'état.
 */
export const handleDecrement = (playerId, currentScore, setScoreCallback) => {
  const newScore = currentScore - 1;
  setScoreCallback(newScore);
  updateScore(playerId, 'score_subtraction', newScore);
  console.log("Decremented xxxxxxxxxxxxxxxx");
};

/**
 * Multiplie le score du joueur par 2.
 *
 * @param {string} playerId - L'ID du joueur.
 * @param {number} currentScore - Le score actuel du joueur.
 * @param {function} setScoreCallback - Callback pour mettre à jour le score dans l'état.
 */
export const handleMultiply = (playerId, currentScore, setScoreCallback) => {
  const newScore = currentScore * 2;
  setScoreCallback(newScore);
  updateScore(playerId, 'score_multiplication', newScore);
};

/**
 * Divise le score du joueur par 2.
 *
 * @param {string} playerId - L'ID du joueur.
 * @param {number} currentScore - Le score actuel du joueur.
 * @param {function} setScoreCallback - Callback pour mettre à jour le score dans l'état.
 */
export const handleDivide = (playerId, currentScore, setScoreCallback) => {
  const newScore = currentScore / 2;
  setScoreCallback(newScore);
  updateScore(playerId, 'score_division', newScore);
};
