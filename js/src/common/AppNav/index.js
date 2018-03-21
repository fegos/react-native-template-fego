/**
 * 应用导航工具
 */
import { NavigationActions, StateUtils, StackNavigator } from 'react-navigation';
import { Message } from 'fego-rn';
import NavDecorator from './NavDecorator';
import Tool from './Tool';

const defaultConfig = {
  rootName: 'Root',
  topRoutes: ['Root', 'Home', 'Position', 'My'], // 'user/Login',
};
// 缓存导航容器，防止重复创建
let NavDecoratorCache;
export default {
  // 导航器实例
  navigator: null,
  // 导航器类
  Navigator: null,
  // 是否处于页面切换中（异步动画中)
  isPageChanging: false,
  // 原方法引用
  defaultGetStateForAction: null,
  // 工具方法
  tool: Tool,
  /**
    * 初始化导航器
    * 不可重复执行
    */
  init(Navigator, conf) {
    this.Navigator = Navigator;
    // 保留原函数
    this.defaultGetStateForAction = this.Navigator.router.getStateForAction;
    this._handleStateForAction();
    // 移除init，不允许重复执行
    delete this.init;
    Object.assign(defaultConfig, conf);
    return this.Navigator;
  },
  /**
    * 设置stack导航配置
    * 不可重复执行
    */
  setStackOpt(StackOpt) {
    const _onTransitionEnd = StackOpt.onTransitionEnd;
    // 页面切换动画结束
    StackOpt.onTransitionEnd = (...args) => {
      _onTransitionEnd && _onTransitionEnd(...args);
      this.isPageChanging = false;
    };
    delete this.setStackOpt;
  },
  createStackNavigator(routeConf, stackOpt) {
    /* eslint no-undef: "off" */
    if (__DEV__) {
      this.setStackOpt && this.setStackOpt(stackOpt);
      return NavDecorator(StackNavigator(routeConf, stackOpt));
    }
    // 防止app退出后但没有被杀死进程的时候，js bundle内容被销毁
    if (!NavDecoratorCache) {
      this.setStackOpt && this.setStackOpt(stackOpt);
      NavDecoratorCache = NavDecorator(StackNavigator(routeConf, stackOpt));
    }
    return NavDecoratorCache;
  },
  /**
   * 响应导航指令
   * @param {*} action
   */
  dispatch(action) {
    this.navigator && this.navigator.dispatch(action);
  },
  /**
    * 导航推出新页面
    */
  nav(routeName, params) {
    const newAction = NavigationActions.navigate({
      routeName,
      params,
    });
    this.dispatch(newAction);
  },
  /**
    * 回退到历史页，不存在则新开
    */
  back(routeName, params) {
    if (routeName) {
      this.dispatch({ type: 'back', routeName, params });
    } else {
      this.dispatch(NavigationActions.back());
    }
  },
  /**
    * 新路由替换当前路由
    */
  replace(routeName, params) {
    this.dispatch({ type: 'replace', routeName, params });
  },
  /**
    * 置顶历史路由，如果不存在则新建
    */
  top(routeName, params) {
    this.dispatch({ type: 'top', routeName, params });
  },
  /**
   * 按路径打开页面
   *
   * @param {Array} 页面路由组成的数组
   * @param {Dictionary} params 传入上层展示页面的数据
   */
  path(routeNames, params) {
    this.dispatch({ type: 'path', routeNames, params });
  },
  /**
    * 重置，会清空历史路由，谨慎使用
    * @param {Object} actionOpt
    * actionOpt = {
    *   index: 1,
    *   actions: [{ routeName: 'a', params: {} }...]
    * }
    */
  reset(actionOpt) {
    const actions = (actionOpt.actions || []).map(item => NavigationActions.navigate({ routeName: item.routeName, params: item.params }));
    const resetAction = NavigationActions.reset({
      index: actionOpt.index || 0,
      actions,
    });
    this.dispatch(resetAction);
  },
  /**
    * 跳回APP根部首页
    * 可用subName指定子路由名称
    */
  root(subName, subParams) {
    this.dispatch({
      type: 'back', routeName: defaultConfig.rootName, subName, subParams,
    });
  },
  /**
    * 依据action新建路由，返回新的state
    * 此时新路由处于栈顶
    */
  crtNewState(action, state) {
    const nextState = this.defaultGetStateForAction({
      ...action,
      type: 'Navigation/NAVIGATE',
    }, state);
    return nextState;
  },
  /**
    * 返回当前页
    */
  getCurRoute() {
    const navState = this.navigator.state.nav;
    return Tool.getCurRoute(navState);
  },
  setParams(params, key) {
    this.dispatch(NavigationActions.setParams({
      params,
      key,
    }));
  },
  _handleStateForAction() {
    // 顶层页数组，跳转顶层页会清除其它页面
    const { topRoutes } = defaultConfig;
    // 监控state变化
    this.Navigator.router.getStateForAction = (action, state) => {
      // 无历史可返回
      if (action.type === 'Navigation/BACK' && (!state || state.routes.length < 2)) return null;
      // 顶层页忽略isPageChanging
      if (topRoutes.indexOf(action.routeName) !== -1) this.isPageChanging = false;
      // 当前页面跳转动画未结束，则忽略下一次跳转请求，防止连点误操作
      if (this.isPageChanging) return null;
      // 若action为自定义类型，则返回相应的state
      let nextState = this._handleSelfType(action, state);
      // 未处理则使用默认函数
      if (!nextState) {
        nextState = this.defaultGetStateForAction(action, state);
      }
      // 若跳转登录页，根路径 则清空路由历史
      if (topRoutes.indexOf(action.routeName) !== -1) {
        nextState = {
          ...nextState,
          routes: [nextState.routes.pop()],
          index: 0,
        };
      }

      const nextScreen = Tool.getCurRouteName(nextState);
      const currentScreen = Tool.getCurRouteName(state);
      // action.routeName 路径无效
      if (state && Tool.getCurRoute(state) === Tool.getCurRoute(nextState)) {
        console.warn(`无效的页面跳转：${action.routeName}，请检查路径！`);
        return null;
      }
      // 全局页面变化前事件
      const rs = Message.emit('pageBeforeChange', {
        // 当前页
        page: currentScreen,
        // 下一页
        nextPage: nextScreen,
        // 当前状态
        state,
        // 下一页状态
        nextState,
        // 操作
        action,
        // 若跳转被终止，可调用next重新跳转
        next: () => {
          this.dispatch(action);
        },
      });
      // 若监听函数中返回false则终止跳转
      if (rs.rets.some(v => v === false)) return null;
      // 存在下一页时，才标记状态
      if (state) this.isPageChanging = true;

      return nextState;
    };
    delete this._handleStateForAction;
  },
  /**
    * 自定义action类型
    */
  _handleSelfType(action, state) {
    if (!state) return null;
    // 跳转Root时使用back，不允许重复创建
    if (action.routeName === defaultConfig.rootName) {
      action.type = 'back';
    }
    switch (action.type) {
      case 'back':
        return this._handleBackToRoute(action, state);
      case 'path':
        return this._handeRoutesPath(action, state);
      case 'top':
        return this._handeRouteTop(action, state);
      case 'replace':
        return this._handeRouteReplace(action, state);
      default:
        return null;
    }
  },
  /**
    * 把历史目标页推到栈顶，若历史不存在则新建
    */
  _handeRouteTop(action, state) {
    let nextState = state;
    let curRoute;
    const newRoutes = nextState.routes.filter((next) => {
      if (next.routeName === action.routeName) {
        curRoute = next;
        return false;
      }
      return true;
    });
    if (curRoute) {
      newRoutes.push(curRoute);
      nextState = {
        ...nextState,
        routes: newRoutes,
        index: newRoutes.length - 1,
      };
    } else {
      nextState = this.crtNewState(action, state);
    }
    return nextState;
  },
  /**
    * 使用新的替换当前页面
    */
  _handeRouteReplace(action, state) {
    let nextState = this.crtNewState(action, state);
    // 取最后一位
    const curRoute = state.routes[state.routes.length - 1];
    // 若当前页是Root则不替换
    if (curRoute.routeName === defaultConfig.rootName) {
      return nextState;
    }
    const newRoute = nextState.routes.pop();
    const newRoutes = state.routes.slice(0, -1);
    newRoutes.push(newRoute);
    nextState = {
      ...nextState,
      routes: newRoutes,
      index: newRoutes.length - 1,
    };
    return nextState;
  },
  /**
    * 退回历史路径，若使用subName则等同子路由action
    * 若历史中存在，则返回到目标页，否则移除当前页新建
    * @param {String} type @required back
    * @param {String} routeName @required 目标页的routeName
    * @param {String} subName @optional [推荐]tab页子路由名称
    * @param {Object} params @optional 传递到目标页的参数
    * @param {Object} subParams @optional 传递tab页子路由的参数
    * 使用方式：
    *   this.props.navigation.dispatch({type: 'back', routeName: defaultConfig.rootName,  ...opt}),注意需要从common模块引入Const
    * 示例：
    *  回退到任意页面(routeName)，如果是首页支持选择tab页(subName)，可以传递参数(subParams)
    */
  _handleBackToRoute(action, state) {
    let nextState = Tool.clone(state);
    let i = nextState.routes.length - 1;
    // 找到action路由所在缓存routes的位置，没有则i=-1
    for (; i > -1; i--) {
      if (nextState.routes[i].routeName === action.routeName) {
        break;
      }
    }
    // 在路由缓存routes里未找到当前action的路由
    if (i < 0) {
      // 使用subName，需要转成子路由action
      if (action.subName) {
        Object.assign(action, {
          routeName: action.routeName,
          params: action.params,
          action: NavigationActions.navigate({
            routeName: action.subName,
            params: action.subParams,
          }),
        });
      }
      // 移除当前页
      nextState = StateUtils.pop(nextState);
      nextState = this.crtNewState(action, nextState);
    } else {
      let count = nextState.routes.length;
      // 目标之后的都pop移除掉
      while (count > i + 1) {
        nextState = StateUtils.pop(nextState);
        count--;
      }
      nextState = { ...nextState };
      // Root路由的子路由单独处理
      if (action.routeName === defaultConfig.rootName) {
        // 子action
        const subAction = action.action || {};
        const tabRoute = nextState.routes[i];
        // subName或者子action
        const subName = action.subName || subAction.routeName;

        // 指定tab子路由名
        if (subName) {
          let tabIndex = 0;
          let subRoute = tabRoute.routes.find((route, index) => {
            if (route.routeName === subName) {
              tabIndex = index;
              return true;
            } else {
              return false;
            }
          });
          subRoute = tabRoute.routes[tabIndex];
          tabRoute.index = tabIndex;
          subRoute.params = action.subParams || subAction.params;
        }
        tabRoute.params = action.params;
      } else {
        nextState.routes[i].params = action.params;
      }
    }
    return nextState;
  },
  /**
    * 按路径依次推出页面
    * 多个页面用-分隔
    * 从当前页面推出，路径最前面的页面不要是首页route
    * 如果是从首页开始指定路径，不关注首页子tab用Root，关注用Home/Position/My
    */
  _handeRoutesPath(action, state) {
    const { topRoutes } = defaultConfig;
    let routes = action.routeNames || [];
    const params = action.params || {};
    const firstRouteName = routes[0];
    let nextState = Tool.clone(state);
    const firstPage = nextState.routes[0];

    if (!firstRouteName) return state;
    // 路径中，topRoutes里的地址只允许位于路径开头
    routes = [firstRouteName, ...routes.slice(1).filter(v => topRoutes.indexOf(v) === -1)];
    // 首页存在子路由，且跳转路径使用了topRoutes
    if (firstPage.routes && topRoutes.indexOf(firstRouteName) !== -1) {
      firstPage.routes.forEach((r, i) => {
        if (r.routeName === firstRouteName) {
          r.params = params;
          firstPage.index = i;
        }
      });
    }
    // 保证firstPage处于第一位
    nextState = {
      ...nextState,
      index: 0,
      routes: [firstPage],
    };
    for (const r of routes) {
      if (topRoutes.indexOf(r) === -1) {
        nextState = this.crtNewState({ routeName: r, params }, nextState);
      }
    }
    return nextState;
  },
};
