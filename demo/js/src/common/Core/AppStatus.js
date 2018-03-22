/**
 * 应用状态组件
 */
import { Message } from 'fego-rn';
import { AppState } from 'react-native';
import { AppNav } from 'common';

export default {
  // 应用是否可见
  visible: true,
  // 应用当前状态
  appState: 'active',
  init() {
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  },
  /**
    * active - 应用正在前台运行
    background - 应用正在后台运行。用户既可能在别的应用中，也可能在桌面。
    inactive - 此状态表示应用正在前后台的切换过程中，或是处在系统的多任务视图，又或是处在来电状态中。
    */
  _handleAppStateChange(nextAppState) {
    const preVisible = this.visible;
    this.visible = nextAppState === 'active';
    this.appState = nextAppState;
    const msg = {
      appState: this.appState,
      visible: this.visible,
    };
    if (AppNav.navigator && AppNav.Navigator) {
      const { router } = AppNav.Navigator;
      const navState = AppNav.navigator.state.nav;
      // 当前显示的页面组件
      msg.Component = router.getComponentForState(navState);
      msg.page = AppNav.tool.getCurRouteName(navState);
      msg.route = AppNav.tool.getCurRoute(navState);
    }

    // 可见状态切换时触发
    if (this.visible !== preVisible) {
      // 业务页面专用全局事件
      Message.emit('appVisible', msg);
      // 框架组件专用全局事件
      Message.emit('appVisible', msg);
      // console.log('appVisible', msg, AppNav)
    }
    // 每次状态变化均触发
    Message.emit('appChange', msg);
    Message.emit('appChange', msg);
  },
};
