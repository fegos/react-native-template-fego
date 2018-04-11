cd ..
projectname=$(basename $PWD)
echo $projectname
cat gitignore >> .gitignore; rm gitignore
echo "+++++++++mod gitignore+++++++++"
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
rm .npmignore
echo "+++++++++remove files+++++++++"
mkdir android/app/src/main/assets
cp resource/song.ttf android/app/src/main/assets/song.ttf
rm android/app/src/main/assets/song.ttf
cp resource/song.ttf android/app/src/main/assets/song.ttf
cd ios/
rm $projectname/AppDelegate.h
mv AppDelegate.h $projectname/AppDelegate.h
rm $projectname/AppDelegate.m
mv AppDelegate.m $projectname/AppDelegate.m
echo "+++++++++mod AppDelegate+++++++++"
cd ../android/
packageName=$(echo $projectname | tr '[A-Z]' '[a-z]')
rm app/src/main/java/com/$packageName/MainApplication.java
rm app/src/main/java/com/$packageName/MainActivity.java
mv MainApplication.java app/src/main/java/com/$packageName/MainApplication.java
mv MainActivity.java app/src/main/java/com/$packageName/MainActivity.java
echo "+++++++++mod MainActivity+++++++++"
cd ..
chmod u+x ./tools/sed.sh
./tools/sed.sh
ruby tools/xcodeFileManager.rb ../ios $projectname add $projectname/song.ttf ../resource/song.ttf
ruby tools/xcodeFileManager.rb ../ios $projectname del Libraries
ruby tools/xcodeFileManager.rb ../ios $projectname del $projectname/main.jsbundle
ruby tools/xcodeFileManager.rb ../ios $projectname script SetIP  "ip=\$(ifconfig | grep 'inet 10.' | head -1 | cut -d \" \" -f 2)+--+if [ ! -f ip.txt ]; then+--+touch ip.txt+--+ruby ../tools/xcodeFileManager.rb ../ios $projectname add ip.txt+--+fi+--+echo \$ip >ip.txt" 0
echo "+++++++++modify files+++++++++"
rm -r node_modules
rm .buckconfig
rm .gitattributes
rm .watchmanconfig
rm .babelrc
mv babelrc .babelrc
