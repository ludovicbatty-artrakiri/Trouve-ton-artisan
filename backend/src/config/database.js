/**
 * Connexion à MySQL / MariaDB via l'ORM Sequelize.
 * Sequelize génère des requêtes PRÉPARÉES : les valeurs saisies par l'utilisateur
 * ne sont jamais concaténées dans le SQL, ce qui protège des injections SQL.
 */
const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  logging: config.isProd ? false : console.log, // pas de requêtes dans les logs en production
  define: {
    timestamps: false,   // les tables n'ont pas de colonnes createdAt / updatedAt
    freezeTableName: true,
  },
  pool: { max: 10, min: 0, idle: 10000 },
});

module.exports = sequelize;
