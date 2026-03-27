export function detectZoom() {
  var ratio = 0, //浏览器当前缩放比
    screen = window.screen, //获取屏幕
    ua = navigator.userAgent.toLowerCase(); //判断登陆端是pc还是手机
  var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  // if (window.devicePixelRatio !== undefined) {
  //   const defaultratio = window.devicePixelRatio
  //   ratio = window.devicePixelRatio / defaultratio
  //   // if (isMac) {
  //   //   ratio = ratio / 2 //mac 视网膜显示屏 默认分辨率2
  //   // }
  // } else
  // if (~ua.indexOf('msie')) {
  //   if (screen.deviceXDPI && screen.logicalXDPI) {
  //     ratio = screen.deviceXDPI / screen.logicalXDPI;
  //   }
  // } else
  if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  }
  if (ratio) {
    ratio = Math.round(ratio * 100);
  }
  return ratio
}
