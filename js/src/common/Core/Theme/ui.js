import {
  Icon, Tag,
  Button, Dialog,
  Segment, Popup,
  Checkbox, Switch,
  MonthPicker, RefreshConfig,
} from 'fego-rn';
import { Text } from 'react-native';
import Const from '../../Const';

/**
 * 常用UI组件样式配置，iconFont初始化
 */
export default {
  init() {
    // 文本默认样式
    Text.defaultProps.style = { fontSize: 12, color: Const.textColor };

    // 初始化组件
    Icon.setFamily({
      song: require('./font/song').default,
    });
    Checkbox.defaultProps.iconFamily = 'song';
    // Checkbox.defaultProps.iconCheckName = 'check';
    // Checkbox.defaultProps.iconUncheckName = 'uncheck-o';
    Checkbox.setBaseStyle(Checkbox, {
      // 默认色调
      icon: {
        color: Const.colorYellow,
      },
      // 选中色调
      checked: {
        color: Const.colorYellow,
      },
      // 禁止态色调
      disabled: {
        color: Const.textColor2,
      },
    });
    Popup.defaultProps.offsetHeight = Const.headerNavHeight + Const.statusBarHeight;
    Popup.defaultProps.iconFamily = 'song';
    Popup.defaultProps.iconTypes = {
      headerLeft: 'arrow-left',
      headerRight: 'close',
    };
    Popup.setBaseStyle(Popup, {
      body: {
        backgroundColor: Const.bgColor2,
      },
      header: {
        borderColor: Const.lineColor,
      },
      headerTitle: {
        color: Const.textColor,
      },
      headerLeftCtn: {
        color: Const.textColor2,
      },
      headerRightCtn: {
        color: Const.textColor2,
      },
    });
    Dialog.tip.setDefaultOption({
      alert: {
        actions: [{ text: '我知道了', type: 'yes', style: { color: Const.colorYellow } }],
      },
      confirm: {
        actions: [{ text: '取消', type: 'no' }, { text: '确定', type: 'yes', style: { color: Const.colorYellow } }],
      },
    });
    Dialog.setBaseStyle(Dialog.tip.TipAgent, {
      content: {
        color: Const.textColor,
      },
      contentHasTitle: {
        color: Const.textColor2,
      },
    });
    Dialog.setBaseStyle(Dialog, {
      header: {
        color: Const.textColor,
      },
      buttonWrapH: {
        borderColor: Const.bgColor,
      },
      buttonWrapV: {
        borderColor: Const.bgColor,
      },
      buttonText: {
        color: Const.textColor2,
      },
      buttonTextOperation: {
        color: Const.textColor2,
      },
    });
    Dialog.defaultProps.underlayColor = Const.bgColor3;
    Button.setBaseStyle(Button, {
      container: {
        borderRadius: 4,
      },
    });
    // 完全重写禁止态样式，而非继承
    Button.baseStyle.disabled = {
      opacity: 0.4,
    };
    Button.baseStyle.textDisabled = {};
    Button.setThemeStyle(Button, {
      type: {
        default: {
          container: {
            borderColor: Const.textColor,
            backgroundColor: 'transparent',
          },
          text: {
            color: Const.textColor,
          },
        },
        primary: {
          container: {
            borderColor: Const.colorYellow,
            backgroundColor: Const.colorYellow,
          },
          text: {
            color: Const.buttonTextColor,
          },
        },
        ghost: {
          container: {
            borderColor: Const.colorYellow,
            backgroundColor: 'transparent',
          },
          text: {
            color: Const.colorYellow,
          },
        },
        green: {
          container: {
            borderColor: Const.colorGreen,
            backgroundColor: Const.colorGreen,
          },
        },
        red: {
          container: {
            borderColor: Const.colorRed,
            backgroundColor: Const.colorRed,
          },
        },
      },
      size: {
        default: {
          container: {
            height: 44,
          },
          text: {
            fontSize: 16,
          },
        },
        middle: {
          container: {
            height: 28,
            paddingHorizontal: 12,
            borderRadius: 2,
          },
          text: {
            fontSize: 15,
          },
        },
        small: {
          container: {
            height: 29,
            borderRadius: 2,
          },
          text: {
            fontSize: 13,
          },
        },
        large: {
          container: {
            height: 54,
          },
          text: {
            fontSize: 18,
          },
        },
      },
    });
    Tag.setBaseStyle({
      container: {
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderColor: Const.textColor2,
        borderRadius: 2,
      },
      selected: {
        backgroundColor: 'transparent',
        borderColor: Const.colorYellow,
      },
      text: {
        fontSize: 13,
        color: Const.colorYellow,
      },
    });
    Segment.defaultProps.themeColor = '#718AAC';
    Segment.setBaseStyle(Segment, {
      container: {
        height: 28,
        borderRadius: 3,
        overflow: 'hidden',
      },
      itemText: {
        fontSize: 13,
      },
    });
    Switch.setBaseStyle(Switch, {
      button: {
        position: 'absolute',
        borderRadius: 21.5 * 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: { height: 1, width: 0 },
      },
      buttonActive: {
        backgroundColor: '#FFF',
      },
      buttonInactive: {
        backgroundColor: '#FFF',
        borderWidth: 1.13,
        borderColor: 'rgba(0,0,0,0.1)',
      },
      buttonDisabled: {
        opacity: 0.5,
        backgroundColor: '#FFF',
      },
      // 底部状态条
      bar: {
        height: 23.5,
        width: 38.5,
        borderRadius: 30,
        borderWidth: 1.13,
        borderColor: 'rgba(0,0,0,0.1)',
      },
      barActive: {
        backgroundColor: Const.colorYellow,
      },
      barInactive: {
        backgroundColor: Const.bgColor4,
      },
      barDisabled: {
        opacity: 0.5,
        // backgroundColor: '#9098AD'
      },
    });
    MonthPicker.setBaseStyle(MonthPicker, {
      container: {
        backgroundColor: Const.bgColor,
      },
      text: {
        color: Const.textColor2,
      },
      selectedText: {
        color: Const.textColor,
      },
      btn: {
        backgroundColor: Const.bgColor2,
      },
    });
    // 在此设定上下拉刷新组件图片type
    RefreshConfig.styleType = Const.refreshViewType;
  },
};
