/**
 * 本地开发配置文件
 * 线上不生效
 */
// 打包平台jenkins会刷新此文件
import env from './env.package'

let HOST_MAP = {
	// 在线配置在config/Fetch中，在这里配置无效
	'online': true,
	'mock': {
		'base': 'http://localhost:3003/app',
		'com': 'http://localhost:3003/com',
		'kline': 'http://localhost:3003/kline',
		'socket': 'http://localhost:9096',
		'socketPath': '',
		'accounts': [
			'121170725095438',
		]
	},
	'dev1': {
		'base': 'http://dev1api.hhtcex.com/app',
		'com': 'http://dev1api.hhtcex.com/com',
		'kline': 'http://dev1kline.hhtcex.com/kline',
		'socket': 'http://dev1lconn.mpush.hhtcex.com',
		'accounts': [
			'121170725095438',
			'121170725795445',
			'121170725795448',
			'121170725595451',
			'121170725795454',
			'121170725195457',
			'121170725895474'
		]
	},
	'dev2': {
		'base': 'http://dev2api.hhtcex.com/app',
		'com': 'http://dev2api.hhtcex.com/com',
		'kline': 'http://dev2kline.hhtcex.com/kline',
		'socket': 'http://dev1lconn.mpush.hhtcex.com',
		'accounts': [
		]
	},
	'test2': {
		'base': 'http://test2api.hhtcex.com/app',
		'com': 'http://test2api.hhtcex.com/com',
		'kline': 'http://test2kline.hhtcex.com/kline',
		'socket': 'http://dev1lconn.mpush.hhtcex.com',
		'accounts': [
			'163170607916740',
			'163170606105040',
			'163170531201986',
			'163170527201436',
			'163170526000744',
			'163170525999788',
			'163170525399783'
		]
	},
	'test3': {
		'base': 'http://test3api.hhtcex.com/app',
		'com': 'http://test3api.hhtcex.com/com',
		'kline': 'http://test3kline.hhtcex.com/kline',
		'socket': 'http://dev1lconn.mpush.hhtcex.com',
	},
	'contest': {
		'base': 'http://contestapi.hhtcex.com/app',
		'com': 'http://contestapi.hhtcex.com/com',
		'kline': 'http://contestkline.hhtcex.com/kline',
		'socket': 'http://dev1lconn.mpush.hhtcex.com',
		'accounts': [
			'O163170602344434',
			'163170303646400',
		]
	},
	'local': {
		'base': 'http://10.235.2.104:3005/app',
		'com': 'http://10.235.2.104:3005/com',
		'kline': 'http://10.235.2.104:3005/kline',
		'socket': 'http://dev1lconn.mpush.hhtcex.com',
	},
	'server': {
		'base': 'http://10.200.242.52:3005/app',
		'com': 'http://10.200.242.52:3005/com',
		'kline': 'http://10.200.242.52:3005/kline',
		'socket': 'http://dev1lconn.mpush.hhtcex.com',
	}
}
let devConfig = {
	HOST_MAP,
	// 测试包，test表示测试环境，别改
	// 打包时用来区分测试包还是线上包
	release: env ? env.releaseModel : 'online',
	// 打包环境的默认host，开启release=test配置时才生效
	releaseHost: env ? env.defaultEnv : '',
	// 开发环境的host
	devHost: 'test2',
	Fetch: {
		// 注释此处，则开启加密
		// 取消注释，则关闭加密
		// beforeUrlParamHandler: null
	},
	StackOpt: {
		/**
		 * 初始页面
		 */
		// initialRouteName: 'Root'
		// initialRouteName: 'test/AppNav',
		// 初始页参数
		// initialRouteParams: {
		// 	date: '2016/01/01'
		// }
	}
}

export default devConfig