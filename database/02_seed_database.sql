-- =============================================================================
--  Trouve ton artisan ! — Script d'ALIMENTATION (jeu d'essai fourni par la Région)
--  À exécuter APRÈS 01_create_database.sql
--  Usage : mysql -u root -p < database/02_seed_database.sql
-- =============================================================================

USE trouve_ton_artisan;

SET NAMES utf8mb4;
START TRANSACTION;   -- tout ou rien : la base n'est jamais à moitié remplie

-- Catégories (ordre du menu demandé dans le brief)
INSERT INTO categorie (nom, slug) VALUES
  ('Bâtiment', 'batiment'),
  ('Services', 'services'),
  ('Fabrication', 'fabrication'),
  ('Alimentation', 'alimentation');

-- Spécialités, rattachées à leur catégorie par son nom (plus lisible et plus sûr qu'un id « en dur »)
INSERT INTO specialite (nom, id_categorie)
  SELECT 'Boucher', id_categorie FROM categorie WHERE nom = 'Alimentation'
UNION ALL
  SELECT 'Boulanger', id_categorie FROM categorie WHERE nom = 'Alimentation'
UNION ALL
  SELECT 'Chocolatier', id_categorie FROM categorie WHERE nom = 'Alimentation'
UNION ALL
  SELECT 'Traiteur', id_categorie FROM categorie WHERE nom = 'Alimentation'
UNION ALL
  SELECT 'Chauffagiste', id_categorie FROM categorie WHERE nom = 'Bâtiment'
UNION ALL
  SELECT 'Electricien', id_categorie FROM categorie WHERE nom = 'Bâtiment'
UNION ALL
  SELECT 'Menuisier', id_categorie FROM categorie WHERE nom = 'Bâtiment'
UNION ALL
  SELECT 'Plombier', id_categorie FROM categorie WHERE nom = 'Bâtiment'
UNION ALL
  SELECT 'Bijoutier', id_categorie FROM categorie WHERE nom = 'Fabrication'
UNION ALL
  SELECT 'Couturier', id_categorie FROM categorie WHERE nom = 'Fabrication'
UNION ALL
  SELECT 'Ferronier', id_categorie FROM categorie WHERE nom = 'Fabrication'
UNION ALL
  SELECT 'Coiffeur', id_categorie FROM categorie WHERE nom = 'Services'
UNION ALL
  SELECT 'Fleuriste', id_categorie FROM categorie WHERE nom = 'Services'
UNION ALL
  SELECT 'Toiletteur', id_categorie FROM categorie WHERE nom = 'Services'
UNION ALL
  SELECT 'Webdesign', id_categorie FROM categorie WHERE nom = 'Services';

-- Villes
INSERT INTO ville (nom) VALUES
  ('Lyon'),
  ('Montélimar'),
  ('Evian'),
  ('Chamonix'),
  ('Bourg-en-bresse'),
  ('Vienne'),
  ('Aix-les-bains'),
  ('Annecy'),
  ('Le Puy-en-Velay'),
  ('Saint-Priest'),
  ('Chambéry'),
  ('Romans-sur-Isère'),
  ('Annonay'),
  ('Valence');

-- Artisans
INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Boucherie Dumont', 4.5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'boucherie.dumond@gmail.com', NULL, FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Boucher' AND v.nom = 'Lyon';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Au pain chaud', 4.8, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'aupainchaud@hotmail.com', NULL, TRUE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Boulanger' AND v.nom = 'Montélimar';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Chocolaterie Labbé', 4.9, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'chocolaterie-labbe@gmail.com', 'https://chocolaterie-labbe.fr', TRUE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Chocolatier' AND v.nom = 'Lyon';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Traiteur Truchon', 4.1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'contact@truchon-traiteur.fr', 'https://truchon-traiteur.fr', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Traiteur' AND v.nom = 'Lyon';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Orville Salmons', 5.0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'o-salmons@live.com', NULL, TRUE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Chauffagiste' AND v.nom = 'Evian';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Mont Blanc Eléctricité', 4.5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'contact@mont-blanc-electricite.com', 'https://mont-blanc-electricite.com', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Electricien' AND v.nom = 'Chamonix';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Boutot & fils', 4.7, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'boutot-menuiserie@gmail.com', 'https://boutot-menuiserie.com', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Menuisier' AND v.nom = 'Bourg-en-bresse';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Vallis Bellemare', 4.0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'v.bellemare@gmail.com', 'https://plomberie-bellemare.com', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Plombier' AND v.nom = 'Vienne';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Claude Quinn', 4.2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'claude.quinn@gmail.com', NULL, FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Bijoutier' AND v.nom = 'Aix-les-bains';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Amitee Lécuyer', 4.5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'a.amitee@hotmail.com', 'https://lecuyer-couture.com', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Couturier' AND v.nom = 'Annecy';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Ernest Carignan', 5.0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'e-carigan@hotmail.com', NULL, FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Ferronier' AND v.nom = 'Le Puy-en-Velay';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Royden Charbonneau', 3.8, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'r.charbonneau@gmail.com', NULL, FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Coiffeur' AND v.nom = 'Saint-Priest';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Leala Dennis', 3.8, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'l.dennos@hotmail.fr', 'https://coiffure-leala-chambery.fr', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Coiffeur' AND v.nom = 'Chambéry';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'C''est sup''hair', 4.1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'sup-hair@gmail.com', 'https://sup-hair.fr', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Coiffeur' AND v.nom = 'Romans-sur-Isère';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Le monde des fleurs', 4.6, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'contact@le-monde-des-fleurs-annonay.fr', 'https://le-monde-des-fleurs-annonay.fr', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Fleuriste' AND v.nom = 'Annonay';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'Valérie Laderoute', 4.5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'v-laredoute@gmail.com', NULL, FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Toiletteur' AND v.nom = 'Valence';

INSERT INTO artisan (nom, note, a_propos, email, site_web, top, id_specialite, id_ville)
SELECT 'CM Graphisme', 4.4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.', 'contact@cm-graphisme.com', 'https://cm-graphisme.com', FALSE,
       s.id_specialite, v.id_ville
FROM specialite s, ville v
WHERE s.nom = 'Webdesign' AND v.nom = 'Valence';

COMMIT;
