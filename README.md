# Catalogue Bibchanfo — GitHub Pages

Ce dossier est prêt à être publié avec GitHub Pages.

Dernière mise à jour: 22-07-2026

## Fichiers

- `index.html` : structure de la page
- `style.css` : apparence
- `script.js` : recherche, filtres et pagination
- `data.csv` : données exportées du fichier Excel

Les valeurs séparées par `|` sont traitées comme plusieurs valeurs. Par exemple, `identité|langue` devient deux sujets distincts et chacun peut être recherché.

## Mettre les données à jour

1. Dans Excel, enregistrez la feuille publique en format **CSV UTF-8 (délimité par des virgules)**.
2. Nommez le fichier exactement `data.csv`.
3. Dans GitHub, ouvrez `data.csv`, puis utilisez **Edit** ou **Upload files** pour le remplacer.
4. Validez avec **Commit changes**.

La page se mettra à jour automatiquement.

## Important

Ne publiez pas les colonnes internes ou confidentielles. Dans ce prototype, les colonnes vides restent dans le CSV, mais `Remarques catalogueur` n’est pas affiché publiquement.


## Données de cette version

Cette version contient **753 notices** provenant du fichier `Bibchanfo.xlsx`.

Les valeurs séparées par une barre verticale (`|`) sont interprétées comme plusieurs auteurs, sujets ou options distinctes.
