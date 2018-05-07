projectname=$(basename $PWD)
echo $projectname
echo "+++++++++mod gitignore+++++++++"
cat gitignore >> .gitignore
echo "+++++++++remove files+++++++++"
rm gitignore
rm App.js
rm app.json
rm index.android.js
rm index.ios.js
rm -r node_modules
rm .buckconfig
rm .gitattributes
rm .watchmanconfig
rm .babelrc
mv babelrc .babelrc
echo "+++++++++mod iOS+++++++++"
mkdir android/app/src/main/assets
cp resource/song.ttf android/app/src/main/assets/song.ttf
rm android/app/src/main/assets/song.ttf
cp resource/song.ttf android/app/src/main/assets/song.ttf
cd ios/
rm $projectname/AppDelegate.h
mv AppDelegate.h $projectname/AppDelegate.h
rm $projectname/AppDelegate.m
mv AppDelegate.m $projectname/AppDelegate.m
echo "+++++++++mod Android+++++++++"
cd ../android/
packageName=$(echo $projectname | tr '[A-Z]' '[a-z]')
rm app/src/main/java/com/$packageName/MainApplication.java
rm app/src/main/java/com/$packageName/MainActivity.java
mv MainApplication.java app/src/main/java/com/$packageName/MainApplication.java
mv MainActivity.java app/src/main/java/com/$packageName/MainActivity.java
cd ..

