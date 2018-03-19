/**
 * 导航配置
 * Stack内嵌Tab
 */
import { TabNavigator } from 'react-navigation';
import MainTabRoute from 'src/main/Route';
import TabOpt from './TabOpt';
import StackOpt from './StackOpt';

const TabNav = TabNavigator(MainTabRoute, TabOpt);
let _StackOpt = StackOpt;
// 启用开发配置
/* eslint no-undef: "off" */
if (__DEV__) {
  _StackOpt = {
    ...StackOpt,
    ...require('src/config.dev').default.StackOpt,
  };
}
export default {
  routeConf: {
    Root: {
      screen: TabNav,
      navigationOptions: {
        header: false,
      },
    },
  },
  stackOpt: _StackOpt,
};

