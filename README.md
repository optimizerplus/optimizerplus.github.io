# Boosteroid Optimizer Plus - Website

Site web officiel statique pour Boosteroid Optimizer Plus, construit avec Next.js 15 et optimisé pour le SEO cloud gaming.

## 🚀 Fonctionnalités

- **Next.js 15** avec export statique
- **SEO puissant** axé sur les mots-clés cloud gaming et Boosteroid
- **Multi-langue** (Anglais + Français)
- **Tailwind CSS** pour un design moderne
- **Thème Boosteroid** fidèle à l'extension
- **Performance optimale** avec export statique

## 📦 Installation

```bash
# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev

# Build pour production (export statique)
pnpm build
```

## 🌐 Déploiement

Le site est conçu pour être déployé sur n'importe quel hébergement statique :

- **Vercel** (recommandé)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**
- **AWS S3 + CloudFront**

### Build statique

```bash
pnpm build
```

Les fichiers sont générés dans le dossier `out/`.

## 🔍 SEO

Le site est optimisé pour les mots-clés suivants :

### Anglais
- Boosteroid optimizer
- Cloud gaming 4K
- Boosteroid upscaling
- Cloud gaming enhancement
- Force 4K resolution
- Low latency cloud gaming

### Français
- Optimiseur Boosteroid
- Cloud gaming 4K
- Améliorer Boosteroid
- Jeu en cloud streaming
- Forcer résolution 4K
- Latence ultra-faible

## 📁 Structure

```
src/
├── app/
│   ├── globals.css      # Styles globaux + Tailwind
│   ├── layout.tsx       # Layout principal + SEO
│   ├── page.tsx         # Page d'accueil (EN)
│   ├── sitemap.ts       # Génération sitemap
│   ├── robots.ts        # Génération robots.txt
│   └── fr/
│       ├── layout.tsx   # Layout FR + SEO
│       └── page.tsx     # Page d'accueil (FR)
└── ...
```

## 📝 License

MIT License - Derfog 2024-2025
