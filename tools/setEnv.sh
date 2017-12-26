#该文件主要是用来打包配置使用
jsFilePath=./src/env.package.js
data=''
#如果存在配置文件则删除
if [ -f $jsFilePath ];then
	rm -rf $jsFilePath
fi
if [ $# = 1 ]; then
	if [ $1 = 'online' ];then
		data="export default { releaseModel: '$1'}"
	elif [ $1 = 'contest' ];then
		data="export default { releaseModel: '$1', defaultEnv:'$1'}"
	fi
elif [ $# = 2 ];then
	if [ $1 = 'test' ];then
	data="export default { releaseModel: '$1', defaultEnv:'$2'}"
	fi
fi
#重写环境配置脚本
echo $data>$jsFilePath
more $jsFilePath

