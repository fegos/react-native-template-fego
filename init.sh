cat gitignore >> .gitignore; rm gitignore
echo "+++++++++mod gitignore+++++++++"
yarn add react-native-fetch-blob@0.10.8
yarn add eslint@4.0.0 --dev
yarn add eslint-plugin-react@7.1.0 --dev
echo "+++++++++dev+++++++++"
rm App.js
rm app.json
rm index.android.js
rm index.ios.js
echo "+++++++++remove files+++++++++"
chmod u+x ./tools/sed.sh
./tools/sed.sh
echo "+++++++++modify files+++++++++"
rm -r node_modules
yarn install
echo "+++++++++yarn install+++++++++"
cd ios/
pod install
echo "+++++++++pod install+++++++++"
cd ..
rm .babelrc
mv babelrc .babelrc
echo "+++++++++mod babelrc+++++++++"
yarn start
echo "+++++++++yarn start+++++++++"