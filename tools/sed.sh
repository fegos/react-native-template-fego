projectname=$(basename $PWD)
echo $projectname

sed -i "" "/Begin PBXContainerItemProxy section/,/End PBXContainerItemProxy section/d" ios/$projectname.xcodeproj/project.pbxproj
sed -i "" "/Begin PBXReferenceProxy section/,/End PBXReferenceProxy section/d" ios/$projectname.xcodeproj/project.pbxproj
sed -i "" "/projectReferences/,/);/d" ios/$projectname.xcodeproj/project.pbxproj
sed -i "" "/RCTActionSheet/d;/RCTGeolocation/d;/RCTAnimation/d;/RCTBlob/d;/RCTImage/d;/RCTLinking/d;/RCTNetwork/d;/RCTSettings/d;/RCTText/d;/RCTWebSocket/d;/RCTVibration/d;/libcxxreact/d;/libjschelpers/d;/libReact/d;/libyoga/d;/React.xcodeproj/d" ios/$projectname.xcodeproj/project.pbxproj

# sed -i "" "/\"react-native\":/d" package.json

sed -i "" "s/miaow/$projectname/g" ios/Podfile
sed -i "" "s/index.ios/index/g" ios/$projectname/AppDelegate.m

sed -i "" "s/miaow/$projectname/g" index.js

# android需要更改的配置
sed -i '' '27a\'$'\n''\'$'\n''@Override\'$'\n''protected String getJSMainModuleName() {\'$'\n''return "index";\'$'\n''}'$'\n' android/app/src/main/java/com/$projectname/MainApplication.java
sed -i '' '29s/^/    /g;30s/^/    /g;31s/^/      /g;32s/^/    /g' android/app/src/main/java/com/$projectname/MainApplication.java
