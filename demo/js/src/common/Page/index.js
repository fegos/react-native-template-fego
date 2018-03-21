/**
 * 功能页基类
 * 依赖AppNav，监听导航变化，需要导航器初始化后方可创建
 * 依赖AppStatus，监听应用状态变化
 * 注意：栈顶是指APP当前显示的页面
 * @author esky
 */
import React from 'react';
import { Message } from 'fego-rn';
import merge from 'lodash/merge';
import AppNav from '../AppNav';

function navigatorCreator(navigation) {
  // 首次加载时拿不到AppNav.navigator
  AppNav.navigator = {
    dispatch: navigation.dispatch,
    state: {
      nav: {
        index: 0,
        routes: [navigation.state],
      },
    },
  };
}
export default class Page extends React.Component {
  appNav = AppNav;
  // 当前实例唯一标识
  key = null
  // 当前实例路由名称
  routeName = null
  // 实例是否可见
  visible = true
  /**
   * 页面创建，初始化属性等
   * @param {*} props
   */
  constructor(props) {
    super(props);
    const { state = {} } = props.navigation;
    if (!AppNav.navigator) navigatorCreator(props.navigation);
    this.key = state.key;
    this.routeName = state.routeName;
    this.on('appVisible', this._handleAppChange);
    this.on('pageBeforeChange', this._handlePageBeforeChange);
    this.on('pageChange', this._handlePageChange);
    console.log(`新建Page ${this.routeName}`, this, Message);
  }
  /**
   * 更新实例的路由参数
   * 与navigation.setParams类似，但新增了参数override
   * 比如：结合 static navigationOptions 使用参数更新navbar的title，buttons等
   * static navigationOptions = ({ navigation }) => {
   *    const { setParams, state } = navigation,
        { params } = state;
        return {
          title: 'xxx',
        }
    }
   */
  setParams(params, override = true) {
    // 不覆盖，则继承原参数，只设置需变更的属性
    if (!override) params = merge({}, this.getParams(), params);
    this.appNav.setParams(params, this.key);
  }
  /**
   * 返回params
   * 始终返回一个正确的对象，不需要判空，直接判断参数属性是否为空即可
   * this.getParams() 返回当前使用的参数对象
   * this.getParams(nextProps) 返回接受到的参数对象
   * 可结合componentWillReceiveProps(nextProps){ let params = this.getParams(nextProps) }
   * @param {*} props
   */
  getParams(props) {
    props = props || this.props;
    if (props.navigation && props.navigation.state) {
      return props.navigation.state.params || {};
    }
    return {};
  }
  /**
   * 页面挂载就绪
   */
  onReady() { }
  /* eslint no-unused-vars:"off" */
  /**
   * 页面开始，用户可见并可以交互
   * 1.从历史回到栈顶
   * 2.栈顶时，应用从后台变成active状态
   * 3.新建时处于栈顶
   * @param {*} msg { type } type 表明start的原因
   */
  onStart(msg = {}) { }
  /**
   * 页面停止，用户不可见或不可交互
   * 1. 进入历史
   * 2. 应用进入inactive状态
   * 3. 将销毁
   * @param {*} msg { type } type 表明stop的原因
   */
  onStop(msg = {}) { }
  /**
   * 页面销毁
   */
  onDestroy() { }
  /**
   * 导航周期：页面进入
   * 1.从历史回到前台
   * 2.新建页面
   */
  onEnter(msg = {}) { }
  /**
   * 导航周期：页面离开
   * 返回false则阻止页面离开
   * 阻止后，若需继续跳转，则调用msg.next()即可。**注意更新条件判断，避免再次被阻止**
   * 1.回到历史
   * 2.从导航栈里移除时（例如back）
   */
  onLeave(msg = {}) { }
  /**
   * 监听全局消息
   * @param {*} eName
   * @param {*} fn
   */
  on(eName, fn) {
    Message.on(`${eName}#${this.key}`, fn);
  }
  /**
   * 注销全局消息
   * 只能注销实例相关的事件函数
   * @param {*} eName
   * @param {*} fn
   */
  off(eName, fn) {
    if (!eName) {
      Message.off(`#${this.key}`);
      return;
    }
    if (fn) {
      Message.off(eName, fn);
    } else {
      Message.off(`${eName}#${this.key}`);
    }
  }
  /**
   * 触发全局消息
   * @param {*} eName
   * @param {*} rest
   */
  emit(eName, ...rest) {
    Message.emit(eName, ...rest);
  }

  _handleAppChange = (msg) => {
    const appVisible = msg.visible;
    // 若当前页是自己
    if (this._getCurKey() === this.key) {
      if (appVisible) {
        this._start(msg.appState);
      } else {
        this._stop(msg.appState);
      }
    }
  }

  _handlePageBeforeChange = (data) => {
    if (this._getCurKey() === this.key) {
      return this.onLeave({
        ...data,
        nextPageKey: this._getCurKey(data.nextState),
      });
    }
    return null;
  }

  _handlePageChange = (data) => {
    if (this._getCurKey() === this.key) {
      this.onEnter({
        ...data,
        prevPageKey: this._getCurKey(data.prevState),
      });
      this._start('nav');
    } else {
      this._stop('nav');
    }
  }

  _getCurKey(state) {
    const curRoute = state ? AppNav.tool.getCurRoute(state) : AppNav.getCurRoute();
    return curRoute.key;
  }

  _start(type) {
    if (!this.visible) {
      this.visible = true;
      this.onStart({ type });
    }
  }

  _stop(type) {
    if (this.visible) {
      this.visible = false;
      this.onStop({ type });
    }
  }

  componentDidMount() {
    this.onReady();
    if (this._getCurKey() === this.key) {
      // 进入start状态，原因为页面就绪后触发
      this.onStart({ type: 'ready' });
    }
  }

  componentWillUnmount() {
    // 非正常退出，保证onStop一定执行
    this._stop('destroy');
    // 清除本实例的事件
    this.off();
    this.onDestroy();
  }
}
