# Portfolio BUT — Vite + GitHub Pages

## Lancer en local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Le build est généré dans `dist/`.

## Déploiement GitHub Pages (GitHub Actions)

Ce projet est configuré pour se déployer automatiquement via le workflow
`.github/workflows/deploy.yml`.

1. Dans GitHub : `Settings` → `Pages` → `Source` → choisir **GitHub Actions**.
2. Pousser sur `main` : le workflow construit et publie `dist/`.

Si besoin d’un déploiement manuel, vous pouvez toujours générer `dist/` avec :

```bash
npm run build
```

## Structure du projet

```
.
├── index.html
├── sae-template.html
├── sae-annees.html
├── public/
│   ├── data/
│   │   ├── portfolio.json
│   │   └── sae/
│   └── .nojekyll
├── src/
│   ├── main.js
│   ├── styles/
│   │   └── main.css
│   └── js/
│       ├── data.js
│       ├── dom.js
│       ├── navigation.js
│       ├── profile.js
│       ├── render-index.js
│       ├── sae-card.js
│       ├── sae-detail.js
│       ├── sae-modal.js
│       ├── sae-years.js
│       └── stats.js
├── package.json
├── vite.config.js
└── .gitignore
```

## Ajouter une nouvelle SAÉ

1. Crée un fichier `public/data/sae/sae-x-yy.json` (copie d’un autre).
2. Ajoute une entrée dans `public/data/portfolio.json` avec :

```json
{
  "id": "sae-x-yy",
  "dataFile": "data/sae/sae-x-yy.json",
  "addedAt": "2026-02-03",
  "year": 2,
  "semester": "S3",
  "title": "SAÉ x.yy — Titre",
  "short": "Résumé court.",
  "duration": "3 semaines",
  "deliverablesCount": 2,
  "teamSize": 3,
  "teamLabel": "Équipe de 3"
}
```

Tout se mettra à jour automatiquement (accueil, années, pop-up, page détail).
