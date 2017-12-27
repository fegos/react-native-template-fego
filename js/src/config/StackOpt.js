import { Message, Icon, Button } from 'fego-rn'
import React from 'react'
import { Const } from 'common'

export default {
	// initialRouteName: 'user/Login',// 默认显示界面
	mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
	cardStyle: { opacity: null },  //产品需求，页面切换不出现渐变色效果
	headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
	onTransitionStart: () => {
		Message.emit('pageChangeAniStart')
	},
	onTransitionEnd: () => {
		Message.emit('pageChangeAniEnd')
	},
	navigationOptions: ({ navigation }) => ({
		headerStyle: {
			height: 44 + (Const.isPhoneX? 44: 0),
			backgroundColor: Const.bgColor2,
			paddingTop: (Const.isPhoneX? 44: 0),
			marginTop: - (Const.isPhoneX? 44: 0),
		},
		headerTitleStyle: {
			color: Const.textColor,
			fontSize: 18
		},
		headerTintColor: Const.textColor,
		headerBackTitle: null,
		headerLeft: (<Button
			style={{ borderWidth: 0, width: Const.goBackWidth, height: Const.headerNavHeight, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: Const.goBackLeft }}
			onPress={() => { navigation.goBack() } }
			>
			<Icon name='goback' family='nsip' size={20} color={Const.textColor}/>
		</Button>),
	}),
}