projectname=$(basename $PWD)
echo $projectname

# sed -i "" "/Begin PBXContainerItemProxy section/,/End PBXContainerItemProxy section/d" ios/$projectname.xcodeproj/project.pbxproj
# sed -i "" "/Begin PBXReferenceProxy section/,/End PBXReferenceProxy section/d" ios/$projectname.xcodeproj/project.pbxproj
# sed -i "" "/projectReferences/,/);/d;/main.jsbundle/d" ios/$projectname.xcodeproj/project.pbxproj
# sed -i "" "/RCTActionSheet/d;/RCTGeolocation/d;/RCTAnimation/d;/RCTBlob/d;/RCTImage/d;/RCTLinking/d;/RCTNetwork/d;/RCTSettings/d;/RCTText/d;/RCTWebSocket/d;/RCTVibration/d;/libcxxreact/d;/libjschelpers/d;/libReact/d;/libyoga/d;/React.xcodeproj/d" ios/$projectname.xcodeproj/project.pbxproj

# sed -i "" "/main.jsbundle/d" ios/$projectname.xcodeproj/project.pbxproj

# sed -i "" "/\"react-native\":/d" package.json

rnSecondVersion=`sed -n "/\"react-native\"/s/[^0]*0\.\([1-9]*\).*/\1/p" package.json`
if [ $rnSecondVersion -gt 48 ]; then
  sed -i "" "/Yoga/s/Yoga/yoga/g" ios/Podfile
fi

sed -i "" "/\'fego/s/fego/$projectname/g" ios/Podfile
sed -i "" "s/index.ios/index/g;s/fego/$projectname/g" ios/$projectname/AppDelegate.m

sed -i "" "/\'fego\'/s/fego/$projectname/g" index.js

# android需要更改的配置
sed -i "/HotUpdatePackage;/s/HotUpdatePackage/service.HotUpdatePackage/" android/app/src/main/java/com/$projectname/MainApplication.java
sed -i '' '30a\'$'\n''\'$'\n''@Override\'$'\n''protected String getJSMainModuleName() {\'$'\n''return "index";\'$'\n''}'$'\n' android/app/src/main/java/com/$projectname/MainApplication.java
sed -i '' '32s/^/  /g;33s/^/  /g;34s/^/    /g;35s/^/  /g' android/app/src/main/java/com/$projectname/MainApplication.java
