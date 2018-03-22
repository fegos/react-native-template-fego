/**
 * 项目核心模块
 * 用于项目初始化等
 */
import { Message } from 'fego-rn';
import DevConf from 'src/config.dev';
import Theme from './Theme';
import AppStatus from './AppStatus';
import './Console';

export default {
  init() {
    AppStatus.init();
    Theme.init();
    // 初始化host
    /* eslint no-undef: "off" */
    if (__DEV__) {
      // 开发包
      Message.emit('switchHost', DevConf.devHost, false);
    } else if (DevConf.release === 'test' || DevConf.release === 'contest') {
      // 测试包
      Message.emit('switchHost', DevConf.releaseHost, false);
    }
  },
};
