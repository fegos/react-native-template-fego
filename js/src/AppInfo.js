// ============== APP各版配置 ==============
export const AppTypes = {
	
	// 默认版
	'main':{
		name: '通用',
		theme: 'black'
	},
	// 电商版
	'ec': {
		name: '电商',
		theme: 'black'
	}
}
let AppInfo = {
	// 当前APP类型
	// APP打包时会修正此属性（RN实例通过props传递）
	type: 'main',
	// 应用注册后执行
	init: function(info){
		// 取打包参数
		// info是平台打包传入的props（通过AppRegistry.registerComponent传入）
		if(info && info.productFlavor){
			this.type = info.productFlavor;
		}
		// 配置类型
		Object.assign(this, AppTypes[this.type])
	}
}
export default AppInfo;