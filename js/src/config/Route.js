/**
 * 导航配置
 * Stack内嵌Tab
 */
import React from 'react'
import { TabNavigator } from 'react-navigation'
import TabOpt from './TabOpt'
import StackOpt from './StackOpt'
import MainTabRoute from 'src/main/Route'

let TabNav = TabNavigator(MainTabRoute, TabOpt)
let _StackOpt = StackOpt;
// 启用开发配置
if (__DEV__) {
	_StackOpt = {
		...StackOpt,
		...require('src/config.dev').default.StackOpt
	}
}
export default {
	routeConf: {
		Root: {
			screen: TabNav,
			navigationOptions: {
				header: false,
			}
		},
	},
	stackOpt: _StackOpt
}

