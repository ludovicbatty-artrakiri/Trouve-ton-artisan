-- =============================================================================
--  Trouve ton artisan ! — Création des TABLES (version hébergement)
--  À utiliser sur un hébergeur mutualisé (ex. alwaysdata) où la base de données
--  et l'utilisateur sont créés depuis le panneau d'administration.
--  Différence avec ../01_create_database.sql : pas de CREATE DATABASE,
--  pas de USE, pas de CREATE USER (impossible sans droits administrateur).
--  Usage : phpMyAdmin > sélectionner la base > onglet « Importer »
--      ou  mysql -h mysql-COMPTE.alwaysdata.net -u COMPTE -p COMPTE_tta < 01_create_tables.sql
-- =============================================================================

SET NAMES utf8mb4;

-- Permet de relancer le script : on supprime d'abord les tables (ordre inverse des clés étrangères)
DROP TABLE IF EXISTS artisan;
DROP TABLE IF EXISTS specialite;
DROP TABLE IF EXISTS ville;
DROP TABLE IF EXISTS categorie;

-- -----------------------------------------------------------------------------
-- Table : categorie  (Bâtiment, Services, Fabrication, Alimentation)
-- -----------------------------------------------------------------------------
CREATE TABLE categorie (
  id_categorie  INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(50)      NOT NULL,
  slug          VARCHAR(60)      NOT NULL,  -- identifiant lisible utilisé dans les URL
  CONSTRAINT pk_categorie       PRIMARY KEY (id_categorie),
  CONSTRAINT uq_categorie_nom   UNIQUE (nom),
  CONSTRAINT uq_categorie_slug  UNIQUE (slug)
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- Table : specialite  (Boucher, Plombier…) — appartient à une seule catégorie
-- -----------------------------------------------------------------------------
CREATE TABLE specialite (
  id_specialite INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(80)      NOT NULL,
  id_categorie  INT UNSIGNED     NOT NULL,
  CONSTRAINT pk_specialite      PRIMARY KEY (id_specialite),
  CONSTRAINT uq_specialite_nom  UNIQUE (nom),
  CONSTRAINT fk_specialite_categorie
    FOREIGN KEY (id_categorie) REFERENCES categorie (id_categorie)
    ON UPDATE CASCADE
    ON DELETE RESTRICT          -- impossible de supprimer une catégorie encore utilisée
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- Table : ville
-- -----------------------------------------------------------------------------
CREATE TABLE ville (
  id_ville      INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(100)     NOT NULL,
  CONSTRAINT pk_ville           PRIMARY KEY (id_ville),
  CONSTRAINT uq_ville_nom       UNIQUE (nom)
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- Table : artisan
-- -----------------------------------------------------------------------------
CREATE TABLE artisan (
  id_artisan    INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(120)     NOT NULL,
  note          DECIMAL(2,1)     NOT NULL DEFAULT 0.0,
  a_propos      TEXT             NULL,
  email         VARCHAR(255)     NOT NULL,
  site_web      VARCHAR(255)     NULL,
  image         VARCHAR(255)     NULL,      -- chemin/URL d'une photo ou d'un logo
  top           BOOLEAN          NOT NULL DEFAULT FALSE,  -- « artisan du mois »
  id_specialite INT UNSIGNED     NOT NULL,
  id_ville      INT UNSIGNED     NOT NULL,
  CONSTRAINT pk_artisan         PRIMARY KEY (id_artisan),
  CONSTRAINT uq_artisan_email   UNIQUE (email),
  CONSTRAINT ck_artisan_note    CHECK (note BETWEEN 0 AND 5),
  CONSTRAINT fk_artisan_specialite
    FOREIGN KEY (id_specialite) REFERENCES specialite (id_specialite)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_artisan_ville
    FOREIGN KEY (id_ville) REFERENCES ville (id_ville)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- Index pour accélérer la recherche par nom et l'affichage des artisans du mois
CREATE INDEX idx_artisan_nom ON artisan (nom);
CREATE INDEX idx_artisan_top ON artisan (top);
