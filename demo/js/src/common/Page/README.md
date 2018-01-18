# 功能页基类
- 依赖AppNav，监听导航变化，需要导航器初始化后方可创建
- 依赖AppStatus，监听应用状态变化

### 生命周期

+ onInit	页面初始化：初始化props和其它属性
+ onReady	页面就绪：资源准备完成，但不一定可见
+ onStart	页面开始：可见，用户可操作
+ onStop	页面停止：不可见，用户不可操作
+ onDestroy	页面销毁：历史回退，清空历史等会导致销毁
#### 导航周期
+ onEnter	页面进入：当前页
+ onLeave	页面离开：返回false则阻止页面离开。阻止后，若需继续跳转，则调用msg.next()即可。**注意更新条件判断，避免再次被阻止**

### 全局消息
实例方法使用的Message组件
- on 注册全局事件，自带#id
- off 注销全局事件，限定只能注销#id或指定fn的事件
- emit 发送全局事件
### 示例
~~~js
export default class BizPage extends Page {
	onInit(props){
		console.log(`页面初始化，key：${this.key}`)
	}
	onReady(){
		console.log(`页面就绪，key：${this.key}`)
	}
	onEnter(msg){
		// 重置判断
		this.leaveCheck = true;
		console.log(`页面进入，key：${this.key}`, msg)
	}
	onLeave(msg){
		console.log(`页面离开，key：${this.key}`, msg)
		// 必需标志：leaveCheck表示需要检查页面离开
		if (this.leaveCheck && msg.nextPage === 'test') {
			Dialog.confirm('确定要离开当前页面吗？跳向' + msg.nextPage, btn => {
				if (btn.type === 'yes') {
					this.leaveCheck = false;
					msg.next();
				}
			})
			// 阻止页面跳转
			return false;
		}
	}
	onStart(msg) {
		console.log(`页面开始，key：${this.key}，用户可见并可操作，原因：${msg.type}`)
	}
	onStop(msg) {
		console.log(`页面停止，key：${this.key}，用户不可见或不可操作，原因：${msg.type}`)
	}
	onDestroy() {
		console.log(`页面销毁，key：${this.key}`)
	}
	render() {
		return (
			<ScrollView style={{ padding: 10, backgroundColor: '#EEE' }}>
				<View style={{ marginBottom: 10 }}>
					<Button title='测试页' onPress={e => this.appNav.nav('test')} />
				</View>
			</ScrollView>
		);
	}
}
~~~