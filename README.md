# Finder App

## ▶️ Usage

1. [Setting up IOS and Android development environment](https://reactnative.dev/docs/environment-setup)

2. Start working

```bash
## install deps
yarn

## install ios pods
yarn setup:ios

## ios
yarn ios

## android
yarn android

```

## ⚙️ Enable husky Git pre-hooks

Add the following script to your `packages.json` and reinstall dependencies to enable husky pre-commit using `yarn install`

```json
"scripts": {
    //...
     "postinstall": "husky install",
  },

```

## 📲 Update App Icon & Splash screen

Run the following command to generate App icons assets :

```
yarn react-native set-icon  --path ./assets/logo.png --background "#FFF"

```

> For android icon, make sure to provide a logo with more padding and generate a new app icon for android :

```
yarn react-native set-icon  --platform android  --path ./assets/android_logo.png --background "#FFF"

```

To generate a standard splash screen using bootsplash package.

```sh
yarn react-native generate-bootsplash assets/logo.png \
  --background-color=FFFFFF \
  --logo-width=150 \
  --assets-path=assets
```

## ✏️ Custom fonts

Replace Inter.ttf font file with your fonts under `assets/fonts` folder

Run the following command to generate App icons assets :

```
yarn react-native link
```
