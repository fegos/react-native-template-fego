/**
 * Tab配置文件
 */
import { Const } from 'common'
export default {
	tabBarPosition: 'bottom',
	animationEnabled: false,
	swipeEnabled: false,
	// tab页延迟渲染
	backBehavior: 'no',
	lazy: true,
	tabBarOptions: {
		showIcon: false,
		showLabel: true,
		upperCaseLabel: false,
		activeTintColor: Const.colorYellow,
		inactiveTintColor: Const.textColor2,
		style: {
			height: 49 + (Const.isPhoneX? 34: 0),
			backgroundColor: Const.bgColor2,
			paddingTop: 5,
			paddingBottom: 4 + (Const.isPhoneX? 34: 0),
			marginBottom: - (Const.isPhoneX? 34: 0),
			borderTopColor: Const.tabBarBorderColor,
		},
		tabStyle: {
			paddingTop: 0,
			paddingBottom: 0
		},
		labelStyle: {
			fontSize: 10,
			margin: 0,
			marginBottom: 0,
		},
		// 仅安卓有效
		iconStyle: {
			height: 26,
			width: '100%'
		},
		// 仅安卓，底部线条
		indicatorStyle: {
			height: 0
		}
	},
}