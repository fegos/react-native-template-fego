/**
 * 日志包装模块
 */

console.ignoredYellowBox = [
  'Setting a timer',
];
// 生成环境不打印日志
/* eslint no-undef: "off" */
if (!__DEV__) {
  const noopFn = function () { };
  for (const k in console) {
    if (Object.prototype.hasOwnProperty.call(console, k)) {
      const orgFn = console[k];
      if (typeof orgFn === 'function') {
        console[k] = noopFn;
      }
    }
  }
}
