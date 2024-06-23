# Utiliser une image Node.js officielle version 18 comme image de base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances de l'application avec l'option --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copier le reste de l'application dans le répertoire de travail
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 19000

# Démarrer l'application
CMD ["npm", "start"]
