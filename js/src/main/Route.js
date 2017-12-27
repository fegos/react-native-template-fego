/**
 * 主入口路径
 */
import React from 'react'
import { View } from 'react-native'
import { Icon, Badge, Message } from 'fego-rn'
class TabIcon extends React.Component {
	render() {
		let { name, iconAttr, hasNew } = this.props;
		// tabBarIcon的父标签必须设置高度以避免icon与label重叠，bug详见： https://github.com/react-community/react-navigation/issues/2805
		return <View style={{ height: 26 }}> 
			<Icon name={name} family='nsip' style={{ color: iconAttr.tintColor, fontSize: 22 }} />
		</View>
	}
}
export default {
	'Home': {
		screen: require('./Home').default,
		path: 'Home',
		navigationOptions: {
			tabBarLabel: '首页',
			tabBarIcon: (iconAttr) => <TabIcon iconAttr={iconAttr} name='home' />
		},
	},
	'Position': {
		screen: require('./Position').default,
		/**
		 * curTab: all outIn
		 * transferTab: in out record
		 */
		path: 'Position',
		navigationOptions: {
			tabBarLabel: '持单',
			tabBarIcon: (iconAttr) => <TabIcon iconAttr={iconAttr} name='position' />
		},
	},
	'My': {
		screen: require('./My').default,
		path: 'My',
		navigationOptions: {
			tabBarLabel: '我的',
			tabBarIcon: (iconAttr) => <TabIcon iconAttr={iconAttr} name='user' />
		},
	},
}