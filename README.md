# [react-native-template-fego](http://fe.hhtcex.com/) &middot; [![npm version](https://badge.fury.io/js/react-native-template-fego.svg)](https://badge.fury.io/js/react-native-template-fego) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/fegos/react-native-template-fego/pulls)

react-native 自定义[模版](https://github.com/facebook/react-native/commit/3ee3d2b4b26e0febb4a7be4258c7706feb040516)。快速构建集导航、高级组件、热更新等能力的react-native项目。

- **官方支持，稳定可靠** RN的0.43版本提供了自定义模板工程的能力。不用担心RNSDK升级导致不可用或者适配困难的问题。
- **快速构建，操作简单** 只需要几分钟，一个可以在安卓和iOS两端运行的RN项目即可构建成功。react init命令完成后，只需要运行init.sh脚本，即可直接进行开发调试。
- **降低门槛，功能强大** 集成导航、[热更新](https://github.com/fegos/fego-rn-update/blob/master/README.md)、[高阶组件](https://github.com/fegos/fego-rn/blob/master/README.md)等能力和技术方案，降低了RN的开发门槛。

要求：>= react-native 0.43, >= iOS 8.0, >= Android 4.1 (API 16)


### Get Started

1. 执行react-native init

	```bash
	$ react-native init projectName --version="RNSDKVersion" --template fego
	# 通过--version来指定所用的react-native版本，可以不指定，会默认使用最高版本。
	```
	注意: 上面的init过程会篡改ttf字体文件的内容导致出错，暂无很好的解决办法，所以init完成之后需要从git下载resource文件夹下的song.ttf文件替换本地的。

2. 执行init.sh脚本, 请勿重复执行

	```bash
	cd projectName
	$ sh init.sh
	```

3. 运行
	直接打开Xcode或者Android Studio运行，或者通过如下命令：

	```bash
	# ios 端
	$ react-native run-ios

	# Android 端
	$ react-native run-android
	```

### 热更新：[fego-rn-update](https://github.com/fegos/fego-rn-update)

### 组件库：[fego-rn](https://github.com/fegos/fego-rn)

### Contributing
有任何疑问或建议，欢迎[Issues](https://github.com/fegos/react-native-template-fego/issues)。
有对代码bug的修正和优化，欢迎[Pull requests](https://github.com/fegos/react-native-template-fego/pulls)。
