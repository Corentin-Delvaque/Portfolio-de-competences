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

## Déploiement GitHub Pages (manuel)

1. Construire le site :

```bash
npm run build
```

2. Pousser le contenu de `dist/` sur une branche `gh-pages` (ou via l'interface GitHub Pages).

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
