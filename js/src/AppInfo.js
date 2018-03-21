// ============== APP各版配置 ==============
// 不同的版本可以使用不同的皮肤和功能配置
export const AppTypes = {

  // 版本一
  main: {
    name: '版本一',
    theme: 'black',
  },
  // 版本二
  second: {
    name: '版本二',
    theme: 'white',
  },
};

const AppInfo = {
  // 当前APP类型
  // APP打包时会修正此属性（RN实例通过props传递）
  type: 'main',
  // 应用注册后执行
  init(info) {
    // 取打包参数
    // info是平台打包传入的props（通过AppRegistry.registerComponent传入）
    if (info && info.productFlavor) {
      this.type = info.productFlavor;
    }
    // 配置类型
    Object.assign(this, AppTypes[this.type]);
  },
};
export default AppInfo;
