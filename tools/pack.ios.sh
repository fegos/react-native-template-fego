#当前rn sdk/app的版本号
vsdk=1.0.1
#临时变量记录当前rn资源数据对应sdk的版本号
data=1
#生成的最终rn zip包的名称
zipname=''
#临时变量记录config文件内容
result=''
#字体文件名
ttfname='nsip.ttf'
#rn资源ftp的相对路径
configDir=/Users/zhaosong/Documents/sourcetree/ftp/rn_nsip_exchange_ios_source/
configPath=$configDir"config"

#删除deploy目录下的所有文件
rm -rf deploy
mkdir deploy
#rn资源打包
react-native bundle --entry-file index.js --platform ios --dev false --bundle-output deploy/index.jsbundle --assets-dest deploy

# #自动生成config文件
echo '==========当前rn资源配置文件============'
more $configPath
echo '==========资源文件版本自增1============='
for line in  `cat $configPath`
do
        arr=(${line//_/ })
        sdk=${arr[0]}
        data=${arr[1]}
        if [[ "$sdk" ==  "$vsdk" ]]; then
          data=$(($data+1))
          zipname="rn_"$sdk"_"$data".zip"
          echo "zipname:"$zipname
        fi

        if [ "$result" = "" ]; then
          result=$sdk"_"$data
        else
          result=$result"\n"$sdk"_"$data
        fi
done
echo $result>$configPath
echo '========资源文件版本自增1结果==========='
more $configPath
#

#拷贝字体文件
cp ../ios/Exchange/Supporting\ Files/$ttfname deploy/$ttfname

#压缩rn资源
cd deploy
zip -r $zipname *
cd ../
ls -l deploy

#拷贝rn资源到指定路径
echo '========拷贝资源文件到git目录==========='
cp deploy/$zipname $configDir
# cp -r ../ReactComponent ../../CFReactNativeDemo/rn

# #推送到git
echo '========推送到git==========='
currentPath=`pwd`
echo $currentPath
cd $configDir
git add .
git commit -m "Exchange-V-iOS-"$vsdk"-"$data
git push
cd $currentPath
