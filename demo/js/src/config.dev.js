/**
 * 本地开发配置文件
 * 线上不生效
 */
// 打包平台jenkins会刷新此文件
import env from './env.package';

const HOST_MAP = {
  // 在线配置在config/Fetch中，在这里配置无效
  online: true,
  mock: {
    base: 'http://localhost:3003/app',
    com: 'http://localhost:3003/com',
    kline: 'http://localhost:3003/kline',
    socket: 'http://localhost:9096',
    socketPath: '',
    accounts: [
      '111111111111111',
    ],
  },
  dev1: {
    base: 'http://dev1api.fego.com/app',
    com: 'http://dev1api.fego.com/com',
    kline: 'http://dev1kline.fego.com/kline',
    socket: 'http://dev1lconn.mpush.fego.com',
    accounts: [
      '111111111111112',
    ],
  },
  dev2: {
    base: 'http://dev2api.fego.com/app',
    com: 'http://dev2api.fego.com/com',
    kline: 'http://dev2kline.fego.com/kline',
    socket: 'http://dev1lconn.mpush.fego.com',
    accounts: [
      '111111111111113',
    ],
  },
  test2: {
    base: 'http://test2api.fego.com/app',
    com: 'http://test2api.fego.com/com',
    kline: 'http://test2kline.fego.com/kline',
    socket: 'http://dev1lconn.mpush.fego.com',
    accounts: [
      '111111111111114',
    ],
  },
  test3: {
    base: 'http://test3api.fego.com/app',
    com: 'http://test3api.fego.com/com',
    kline: 'http://test3kline.fego.com/kline',
    socket: 'http://dev1lconn.mpush.fego.com',
  },
  contest: {
    base: 'http://contestapi.fego.com/app',
    com: 'http://contestapi.fego.com/com',
    kline: 'http://contestkline.fego.com/kline',
    socket: 'http://dev1lconn.mpush.fego.com',
    accounts: [
      '111111111111115',
    ],
  },
  local: {
    base: 'http://10.235.2.104:3005/app',
    com: 'http://10.235.2.104:3005/com',
    kline: 'http://10.235.2.104:3005/kline',
    socket: 'http://dev1lconn.mpush.fego.com',
  },
  server: {
    base: 'http://10.200.242.52:3005/app',
    com: 'http://10.200.242.52:3005/com',
    kline: 'http://10.200.242.52:3005/kline',
    socket: 'http://dev1lconn.mpush.fego.com',
  },
};
const devConfig = {
  HOST_MAP,
  // 测试包，test表示测试环境，别改
  // 打包时用来区分测试包还是线上包
  release: env ? env.releaseModel : 'online',
  // 打包环境的默认host，开启release=test配置时才生效
  releaseHost: env ? env.defaultEnv : '',
  // 开发环境的host
  devHost: 'test2',
  Fetch: {
    // 注释此处，则开启加密
    // 取消注释，则关闭加密
    // beforeUrlParamHandler: null
  },
  StackOpt: {
    /**
     *  * 初始页面
     */
    // initialRouteName: 'Root'
    // initialRouteName: 'test/AppNav',
    // 初始页参数
    // initialRouteParams: {
    // date: '2016/01/01'
    // }
  },
};

export default devConfig;
