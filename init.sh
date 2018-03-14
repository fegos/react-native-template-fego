projectname=$(basename $PWD)
echo $projectname

cat gitignore >> .gitignore; rm gitignore
echo "+++++++++mod gitignore+++++++++"
yarn add react-native-fetch-blob@0.10.8
yarn add eslint@^4.0.0 --dev
yarn add eslint-plugin-react@7.1.0 --dev
yarn add babel-eslint@8.0.2 --dev
yarn add babel-jest@22.4.1 --dev
yarn add babel-preset-react-native@4.0.0 --dev
yarn add eslint@^4.16.0 --dev
yarn add eslint-config-airbnb@^16.1.0 --dev
yarn add eslint-plugin-import@^2.8.0 --dev
yarn add eslint-plugin-jsx-a11y@^6.0.3 --dev
yarn add eslint-plugin-react@^7.6.0 --dev
echo "+++++++++dev+++++++++"
rm App.js
rm app.json
rm index.android.js
rm index.ios.js
echo "+++++++++remove files+++++++++"
cd ios/
rm $projectname/AppDelegate.h
mv AppDelegate.h $projectname/AppDelegate.h
rm $projectname/AppDelegate.m
mv AppDelegate.m $projectname/AppDelegate.m
echo "+++++++++mod AppDelegate+++++++++"
cd ..
chmod u+x ./tools/sed.sh
./tools/sed.sh
ruby tools/xcodeFileManager.rb ../ios $projectname add ip.txt
ruby tools/xcodeFileManager.rb ../ios $projectname del Libraries
ruby tools/xcodeFileManager.rb ../ios $projectname del $projectname/main.jsbundle
ruby tools/xcodeFileManager.rb ../ios $projectname script SetIP  "ip=\$(ifconfig | grep 'inet 10.' | head -1 | cut -d \" \" -f 2)+--+if [ ! -f ip.txt ]; then+--+touch ip.txt+--+ruby ../tools/xcodeFileManager.rb ../ios $projectname add ip.txt+--+fi+--+echo \$ip >ip.txt" 0
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
