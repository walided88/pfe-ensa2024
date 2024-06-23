import SQLite from 'react-native-sqlite-storage';

const database_name = "GameDatabase.db";
const database_version = "1.0";
const database_displayname = "SQLite Game Database";
const database_size = 200000;

let db;

/**
 * Fonction pour ouvrir la base de données.
 * Si la base de données n'est pas encore ouverte, elle sera initialisée et ouverte.
 */
export const openDatabase = () => {
  if (!db) {
    db = SQLite.openDatabase(
      {
        name: database_name,
        location: 'default'
      },
      () => { console.log("Database opened successfully") },
      error => { console.log("Error opening database: ", error) }
    );
  }
};

/**
 * Fonction générique pour exécuter une requête SQL.
 *
 * @param {string} query - La requête SQL à exécuter.
 * @param {array} params - Les paramètres de la requête SQL.
 * @param {function} successCallback - Callback en cas de succès.
 * @param {function} errorCallback - Callback en cas d'erreur.
 */
const executeQuery = (query, params = [], successCallback = null, errorCallback = null) => {
  if (!db) {
    console.log("Database is not opened");
    return;
  }
  
  db.transaction(tx => {
    tx.executeSql(
      query,
      params,
      (tx, results) => {
        if (successCallback) {
          successCallback(tx, results);
        }
      },
      (tx, error) => {
        if (errorCallback) {
          errorCallback(tx, error);
        } else {
          console.log("Error executing query: ", error);
        }
      }
    );
  });
};

/**
 * Fonction pour créer la table Players si elle n'existe pas.
 */
export const createTable = () => {
  const query = `CREATE TABLE IF NOT EXISTS Players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    score_addition INTEGER,
    score_subtraction INTEGER,
    score_multiplication INTEGER,
    score_division INTEGER,
    profile_image_path TEXT
  );`;
  
  executeQuery(query, [], () => console.log("Table created successfully"));
};

/**
 * Fonction pour ajouter un joueur à la table Players.
 *
 * @param {string} name - Le nom du joueur.
 * @param {function} callback - Callback avec l'ID du joueur ajouté.
 */
export const addPlayer = (name, callback) => {
  const query = `INSERT INTO Players (name, score_addition, score_subtraction, score_multiplication, score_division, profile_image_path) 
                 VALUES (?, 0, 0, 0, 0, ?)`;
  const params = [name, "default_profile_image.png"];
  
  executeQuery(query, params, (tx, results) => {
    console.log("Player added successfully");
    const playerId = results.insertId; // Récupérer l'ID du joueur ajouté
    console.log("New player ID:", playerId);
    if (callback) {
      callback(playerId);
    }
  }, (tx, error) => {
    console.log("Error adding player: ", error);
    if (callback) {
      callback(null);
    }
  });
};

/**
 * Fonction pour récupérer tous les joueurs de la table Players.
 *
 * @param {function} callback - Callback avec la liste des joueurs.
 */
export const getPlayers = (callback) => {
  const query = `SELECT * FROM Players`;
  
  executeQuery(query, [], (tx, results) => {
    let players = [];
    for (let i = 0; i < results.rows.length; i++) {
      players.push(results.rows.item(i));
    }
    callback(players);
  }, (tx, error) => {
    console.log("Error retrieving players: ", error);
    callback([]);
  });
};

/**
 * Fonction pour récupérer un joueur par son ID.
 *
 * @param {number} id - L'ID du joueur.
 * @param {function} callback - Callback avec les données du joueur.
 */
export const getPlayerById = (id, callback) => {
  const query = `SELECT * FROM Players WHERE id = ?`;
  
  executeQuery(query, [id], (tx, results) => {
    if (results.rows.length > 0) {
      callback(results.rows.item(0));
    } else {
      callback(null);
    }
  }, (tx, error) => {
    console.log("Error retrieving player: ", error);
    callback(null);
  });
};

/**
 * Fonction générique pour incrémenter un score.
 *
 * @param {number} id - L'ID du joueur.
 * @param {number} incrementValue - La valeur d'incrémentation du score.
 * @param {string} scoreType - Le type de score à incrémenter.
 * @param {function} callback - Callback en cas de succès ou d'erreur.
 */
const incrementScore = (id, incrementValue, scoreType, callback) => {
  const column = `score_${scoreType}`;
  const query = `UPDATE Players SET ${column} = ${column} + ? WHERE id = ?`;
  const params = [incrementValue, id];
  
  executeQuery(query, params, (tx, results) => {
    console.log(`Score ${scoreType} incremented by ${incrementValue} for player ID ${id}`);
    if (callback) {
      callback();
    }
  }, (tx, error) => {
    console.log(`Error incrementing score ${scoreType}: `, error);
    if (callback) {
      callback(null);
    }
  });
};

// Fonctions spécifiques pour incrémenter chaque type de score
export const incrementScoreAddition = (id, incrementValue, callback) => {
  incrementScore(id, incrementValue, 'addition', callback);
};

export const incrementScoreSubtraction = (id, incrementValue, callback) => {
  incrementScore(id, incrementValue, 'subtraction', callback);
};

export const incrementScoreMultiplication = (id, incrementValue, callback) => {
  incrementScore(id, incrementValue, 'multiplication', callback);
};

export const incrementScoreDivision = (id, incrementValue, callback) => {
  incrementScore(id, incrementValue, 'division', callback);
};

/**
 * Fonction pour vérifier si un joueur existe dans la table Players.
 *
 * @param {string} name - Le nom du joueur.
 * @returns {Promise<boolean>} - Une promesse qui résout à true si le joueur existe, sinon false.
 */
export const checkPlayerExists = (name) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM Players WHERE name = ?`;
    const params = [name];
    
    executeQuery(query, params, (tx, results) => {
      const count = results.rows.item(0).count;
      console.log(`Player ${name} exists: ${count > 0}`);
      resolve(count > 0);
    }, (tx, error) => {
      console.log("Error checking player existence: ", error);
      reject(error);
    });
  });
};
