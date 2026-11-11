# Tournée PL, version installable

Même application que la version Claude, point par point : plan jour par jour, horaires, pauses et
amplitude, interdictions PL (week-end, fériés), remorque posée et transvasements, plan de chargement
porteur et remorque, restrictions personnelles, sauvegarde et restauration.

Elle tourne entièrement sur l'appareil, sans compte et sans Claude, et fonctionne **hors ligne** une fois installée.

## Lancer sur un ordinateur

| Système | Ce qu'il faut faire |
|---|---|
| Windows | double-clic sur `lancer-windows.bat` (marche avec ou sans Python) |
| Mac / Linux | double-clic sur `lancer-mac-linux.sh`, ou dans un terminal : `sh lancer-mac-linux.sh` |

Le navigateur s'ouvre sur **http://localhost:8765**. Garde la petite fenêtre noire ouverte pendant l'utilisation.

**Installer l'application** : onglet *Réglages* → carte *Application* → **Installer l'application**
(ou icône d'installation dans la barre d'adresse de Chrome ou Edge). Elle s'ouvre ensuite depuis le menu
Démarrer ou le Dock, comme un vrai logiciel, même sans internet.

> Un simple double-clic sur `index.html` marche aussi, mais sans installation ni mode hors ligne :
> les navigateurs ne l'autorisent que pour une adresse `http://localhost` ou `https://`.

## Installer sur un téléphone

Un téléphone exige une adresse **https**. Le plus simple, gratuit :

1. **Netlify Drop** : va sur https://app.netlify.com/drop et glisse le dossier `tournee-pl`. Tu obtiens une adresse https.
2. ou **GitHub Pages** sur ce dépôt (Settings → Pages), puis ouvre `…/tournee-pl/`.

Ouvre l'adresse sur le téléphone, puis :
- **Android (Chrome)** : menu ⋮ → *Installer l'application* ;
- **iPhone (Safari)** : *Partager* → *Sur l'écran d'accueil*.

Les données restent dans le téléphone, rien n'est stocké sur le site.

## Ce qui marche hors ligne, ce qui demande internet

| Fonction | Hors ligne | Avec internet |
|---|---|---|
| Calcul de tournée, horaires, chargement, interdictions | oui | oui |
| Villes de la base intégrée (~230 villes du Grand Ouest et grandes villes) | oui | oui |
| Villes déjà trouvées une fois | oui (gardées sur l'appareil) | oui |
| **Toutes** les communes de France | non | oui, via geo.api.gouv.fr (service public gratuit) |
| Position précise à l'**adresse** | non | oui, via la Base Adresse Nationale (adresse.data.gouv.fr) |
| Lecture d'une **photo** de feuille de route | après le 1er usage | oui (moteur de lecture d'environ 5 Mo téléchargé au premier usage) |

Un client saisi hors ligne dans une ville inconnue reste *À localiser* et se localise tout seul au retour du réseau.

## Différences avec la version Claude

- **Photo** : la lecture se fait sur l'appareil (reconnaissance de texte), sans intelligence artificielle.
  Le texte lu s'affiche d'abord pour que tu le corriges, puis *Ajouter les clients*. Elle marche bien sur
  une feuille imprimée et nette, mal sur l'écriture manuscrite.
- **Coller un texte** : une ligne par client, ou un bloc par client séparé par une ligne vide. Exemple :

  ```
  Brico Vitré, 12 rue de Paris, 35500 Vitré, 3 pal, 1 haute, 800 kg, 7h30-12h 13h30-17h
  Négoce Dupont, Lamballe 22400, 2 pal, porteur seul
  ```

  Reconnus : code postal, palettes (`3 pal`), palettes hautes (`1 haute`), poids (`1 200 kg`),
  un ou deux créneaux (`8h-12h 14h-17h`), `porteur seul`.
- **Localisation** : services publics gratuits à la place de l'estimation par Claude. C'est plus précis : au numéro de rue quand l'adresse est donnée.

## Données et mises à jour

- Tout est enregistré dans le navigateur de l'appareil. *Réglages → Données → Sauvegarder* crée un fichier
  `.json`, et *Restaurer* le recharge, sur le même appareil ou un autre. Une sauvegarde de la version Claude se restaure aussi.
- Pour mettre à jour l'app installée : remplace les fichiers du dossier, ou republie-les sur le site, puis rouvre l'app deux fois.

## Contenu du dossier

```
index.html            l'application, en un seul fichier
sw.js                 fonctionnement hors ligne
manifest.webmanifest  nom, icônes, couleurs de l'application installée
icons/                icônes
serveur.py            petit serveur local (Python)
serveur.ps1           serveur local de secours pour Windows sans Python
lancer-windows.bat    lancement Windows
lancer-mac-linux.sh   lancement Mac / Linux
```
