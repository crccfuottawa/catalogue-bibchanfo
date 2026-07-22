# Prototype de catalogue Bibchanfo — GitHub Pages

Ce dossier est prêt à être publié avec GitHub Pages.

## Fichiers

- `index.html` : structure de la page
- `style.css` : apparence
- `script.js` : recherche, filtres et pagination
- `data.csv` : données exportées du fichier Excel

Les valeurs séparées par `|` sont traitées comme plusieurs valeurs. Par exemple, `identité|langue` devient deux sujets distincts et chacun peut être recherché.

## Mise en ligne sur GitHub

1. Créez un compte gratuit sur GitHub, au besoin.
2. Cliquez sur **New repository**.
3. Nommez-le, par exemple, `catalogue-bibchanfo`.
4. Choisissez **Public**.
5. Cliquez sur **Create repository**.
6. Dans le dépôt, cliquez sur **Add file > Upload files**.
7. Téléversez les quatre fichiers de ce dossier, puis cliquez sur **Commit changes**.
8. Ouvrez **Settings > Pages**.
9. Sous **Build and deployment**, choisissez **Deploy from a branch**.
10. Choisissez la branche `main` et le dossier `/ (root)`, puis cliquez sur **Save**.

L’adresse sera normalement :

`https://VOTRE-NOM.github.io/catalogue-bibchanfo/`

## Mettre les données à jour

1. Dans Excel, enregistrez la feuille publique en format **CSV UTF-8 (délimité par des virgules)**.
2. Nommez le fichier exactement `data.csv`.
3. Dans GitHub, ouvrez `data.csv`, puis utilisez **Edit** ou **Upload files** pour le remplacer.
4. Validez avec **Commit changes**.

La page se mettra à jour automatiquement.

## Important

Ne publiez pas les colonnes internes ou confidentielles. Dans ce prototype, les colonnes vides restent dans le CSV, mais `Remarques catalogueur` n’est pas affiché publiquement.


## Données de cette version

Cette version contient **759 notices** provenant du fichier `Bibchanfo.xlsx`.

Les valeurs séparées par une barre verticale (`|`) sont interprétées comme plusieurs auteurs, sujets ou options distinctes.
