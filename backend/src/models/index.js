/**
 * Modèles Sequelize — reflet exact du MLD (voir database/01_create_database.sql).
 *
 *   categorie 1 ──< specialite 1 ──< artisan >── 1 ville
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categorie = sequelize.define('categorie', {
  id_categorie: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(50), allowNull: false },
  slug: { type: DataTypes.STRING(60), allowNull: false },
});

const Specialite = sequelize.define('specialite', {
  id_specialite: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(80), allowNull: false },
});

const Ville = sequelize.define('ville', {
  id_ville: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
});

const Artisan = sequelize.define('artisan', {
  id_artisan: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(120), allowNull: false },
  note: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    // DECIMAL est renvoyé sous forme de chaîne par mysql2 : on le convertit en nombre
    get() {
      return Number(this.getDataValue('note'));
    },
  },
  a_propos: { type: DataTypes.TEXT },
  email: { type: DataTypes.STRING(255), allowNull: false },
  site_web: { type: DataTypes.STRING(255) },
  image: { type: DataTypes.STRING(255) },
  top: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

// --- Associations (cardinalités du MCD)
Categorie.hasMany(Specialite, { foreignKey: 'id_categorie' });
Specialite.belongsTo(Categorie, { foreignKey: 'id_categorie' });

Specialite.hasMany(Artisan, { foreignKey: 'id_specialite' });
Artisan.belongsTo(Specialite, { foreignKey: 'id_specialite' });

Ville.hasMany(Artisan, { foreignKey: 'id_ville' });
Artisan.belongsTo(Ville, { foreignKey: 'id_ville' });

module.exports = { sequelize, Categorie, Specialite, Ville, Artisan };
