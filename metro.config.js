const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

/**
 * Exportation de la configuration Metro
 * 
 * Utilisation de `mergeConfig` pour combiner la configuration par défaut de Metro avec des options personnalisées.
 * Ici, nous ajoutons l'extension de fichier `mp3` à la liste des extensions d'actifs résolus par Metro.
 */
module.exports = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    assetExts: ['mp3', ...getDefaultConfig(__dirname).resolver.assetExts],
  },
});
