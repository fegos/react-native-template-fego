/**
 * 常量模块
 */
import { StatusBar, Platform, Dimensions } from 'react-native';
import Theme from './Theme';
import AppInfo from '../../AppInfo';
import Word from './Word';

const window = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';
const isPhoneX = isIOS && window.height === 812;
const Const = {
  // app相关信息
  appInfo: AppInfo,
  window,
  isAndroid,
  isIOS,
  isPhoneX,
  // 导航头部高度
  headerNavHeight: isAndroid ? 56 : 44,
  // tab下方导航条的高度
  tabNavHeight: 50,
  // 距离底部距离
  bottomPadding: isPhoneX ? 34 : 0,
  // 状态栏高度
  /* eslint no-nested-ternary: "off" */
  statusBarHeight: isAndroid ? StatusBar.currentHeight : (isPhoneX ? 44 : 20),
  // 导航栏返回按钮icon的左边距
  goBackLeft: 12,
  // 导航栏返回按钮的宽度
  goBackWidth: 50,
  // 当前屏幕与视觉屏幕的宽度比
  screenWidthRate: window.width / 375.0,
  // 当前屏幕与视觉屏幕的高度比
  screenHeightRate: window.height / 667.0,
  // 文案字典
  word: Word[AppInfo.type],
  // 主题切换方法
  changeTheme(name) {
    const themeObj = Theme[name] || {};
    Object.assign(this, themeObj);
  },
};
Const.changeTheme(AppInfo.theme);
export default Const;
