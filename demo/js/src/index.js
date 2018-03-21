import React from 'react';
import { AppNav } from 'src/common';
import Route from 'src/config/Route';
import ErrorUtils from 'ErrorUtils';

//========= 模块初始化 start ==========
/* eslint no-undef: "off" */
if (!__DEV__) {
  ErrorUtils.setGlobalHandler(() => {
    // alert("异常", JSON.stringify(e))
  });
}

// 应用导航容器
const AppNavigator = AppNav.createStackNavigator(Route.routeConf, Route.stackOpt);

//= ======== 模块初始化 end ==========

/**
 * 应用框架
 * 注意：因安卓back键推出应用等会导致App再次创建
 */
export default() => (
  <AppNavigator />
);
