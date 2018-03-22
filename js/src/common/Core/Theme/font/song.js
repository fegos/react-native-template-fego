/**
 * 交易所字体定义
 * 命名规则：名称-类别1-类别2
 * 例如：arrow-circle-o-up 含义：箭头-环形的，镂空的，向上的
 * 类别：
 * o 镂空图标，内部镂空
 * circle 环形图标
 * square 方形图标
 * left 左向
 * right 右向
 * up 向上
 * down 向下
 */
const song = {
  // 首页
  home: 'e61f',
  // 清单
  list: 'e68d',
  // 用户
  account: 'e6a3',
  // 左箭头
  'arrow-left': 'e64c',
  // 关闭
  close: 'e652',
};

for (const k in song) {
  if (Object.prototype.hasOwnProperty.call(song, k)) {
    song[k] = parseInt(song[k], 16);
  }
}

export default song;
