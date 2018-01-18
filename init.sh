projectname=$(basename $PWD)
echo $projectname

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
ruby tools/xcodeFileManager.rb ../ios $projectname script SetIP  "ip=\$(ifconfig | grep 'inet 10.' | head -1 | cut -d \" \" -f 2)+--+echo \$ip+--+sed -i \"\" '1 c\\'$'\\n'\$ip\$'\\n' ip.txt" 0
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