import React from 'react';
import { AppNav } from 'src/common';
import Route from 'src/config/Route';
import ErrorUtils from 'ErrorUtils';
// import default from '../../../../../../Library/Caches/typescript/2.6/node_modules/@types/react-native-fetch-blob';

// const { NIPRNEventEmitter } = NativeModules;
// const nipEventEmitter = new NativeEventEmitter(NIPRNEventEmitter);

//= ======== 模块初始化 start ==========
/**
 * 模块初始化，只允许执行一次
 */
// let { DataCollection, Fabric } = native;
// let mappings = {};

/* eslint no-undef: "off" */
if (!__DEV__) {
  ErrorUtils.setGlobalHandler(() => {
    // alert("异常", JSON.stringify(e))
  });
}
// 核心组件初始化
// Core.init();
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
