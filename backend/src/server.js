/**
 * Point d'entrée : vérifie la connexion à la base puis démarre le serveur HTTP.
 */
const app = require('./app');
const config = require('./config/env');
const { sequelize } = require('./models');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie.');
    app.listen(config.port, () => {
      console.log(`API Trouve ton artisan démarrée sur le port ${config.port} (${config.env}).`);
    });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error.message);
    process.exit(1);
  }
}

start();
