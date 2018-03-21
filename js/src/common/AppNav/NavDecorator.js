/**
 * 导航组件装饰函数
 * 基于react-navigation的高阶函数
 * @param {*} Navigator
 */
import { Message } from 'fego-rn';
import React from 'react';
import AppNav from './index';

const NavDecorator = Navigator => (props) => {
  AppNav.init && AppNav.init(Navigator);
  return (<Navigator
    uriPrefix="fego://"
    {...props}
    ref={(nav) => {
    // 注意 hotreload 时 nav会为null，仅当nav存在时才设置
      if (nav) AppNav.navigator = nav;
    }}
    onNavigationStateChange={(prevState, state) => {
      const currentScreen = AppNav.tool.getCurRouteName(state);
      const prevScreen = AppNav.tool.getCurRouteName(prevState);
      if (prevScreen !== currentScreen) {
        // 全局页面变化事件（当前页挂载完毕）
        Message.emit('pageChange', {
          page: currentScreen,
          // 前一页
          prevPage: prevScreen,
          state,
          // 前一页状态
          prevState,
        });
      }
    }}
  />);
};
export default NavDecorator;
