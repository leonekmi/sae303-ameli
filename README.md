# SAE 3D03 - Leon Lozahic

`util` contient les scripts utilisés pour convertir les données de la Cnam en GeoJSON, format standard pour l'affichage sur les cartes.

Ce fichier GeoJSON est ensuite servi via un *tile server* (en l'occurence [france.leonekmi.fr](https://france.leonekmi.fr)), un serveur qui va se charger de fragmenter les données en pleins de morceaux pour éviter que le navigateur télécharge l'intégralité du fichier avant de pouvoir commencer à travailler.

Par la suite, le traitement pour trouver le professionnel de santé le plus proche est réalisé directement sur le navigateur à l'aide de [Turf.js](https://turfjs.org/), qui fournit des dizaines d'outils pour travailler avec des positions.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
