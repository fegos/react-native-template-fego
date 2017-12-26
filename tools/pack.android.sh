#当前rn sdk的版本号
vsdk=1.1.0
#临时变量记录当前rn资源数据对应sdk的版本号
data=1
#生成的最终rn zip包的名称
zipname=''
#临时变量记录config文件内容
result=''
#rn资源ftp的相对路径
#mac
# configDir=/Users/wangxiang/WorkSpace/ftp/rn_nsip_exchange_android_source/
configDir=/Users/sxiaoxia/Desktop/work/project/ftp/rn_nsip_exchange_android_source/
#windows
# configDir="D:\\project\\NewProject\\ftp\\rn_nsip_exchange_android_source\\"
configPath=$configDir"config"

#删除deploy目录下的所有文件
rm -rf deploy
mkdir deploy
#rn资源打包
react-native bundle --entry-file index.js --platform android --dev false --bundle-output deploy/index.bundle --assets-dest deploy
#copy react-bundle包到android assets下的rn目录
rm -rf ../android/exchange/src/main/assets/rn
cp -rf deploy ../android/exchange/src/main/assets/rn
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

#压缩rn资源
cd deploy
zip -r $zipname *
cd ../
ls -l deploy

# #拷贝rn资源到指定路径
echo '========拷贝资源文件到git目录==========='
cp deploy/$zipname $configDir

# #推送到git
echo '========推送到git==========='
currentPath=`pwd`
echo $currentPath
cd $configDir
git pull
git add .
git commit -m "Exchange-V-Android-"$vsdk"-"$data
git push
cd $currentPath
