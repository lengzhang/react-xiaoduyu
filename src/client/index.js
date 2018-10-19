import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from '../store';
import createRouter from '../router';

// 引入全局样式
import '../pages/global.scss';

// 网页图片浏览器
// WebPictureViewer(['https://avatars3.githubusercontent.com/u/888115?v=3&s=40']);
import '../vendors/web-picture-viewer.js';

// ArriveFooter 监听抵达页尾的事件
import '../vendors/arrive-footer.js';

// ScrollListener 监听 scoll 的事件
import '../vendors/scroll-listener.js';

/**
 * 懒加载图片、Dom
 * 使用方式
 * 给dom添加class="load-demand"、data-load-demand="<div></div> or <img />"
 **/
import '../vendors/load-demand';

// [todo]
// import runtime from 'serviceworker-webpack-plugin/lib/runtime'
// if ('serviceWorker' in navigator) {
//   const registration = runtime.register();
// } else {
//   console.log("Don't support serviceWorker")
// }

// 从页面中获取服务端生产redux数据，作为客户端redux初始值
const store = configureStore(window.__initState__);

const RouterDom = createRouter(null).dom;

ReactDOM.hydrate((
  <Provider store={store}>
    <BrowserRouter>
      <RouterDom />
    </BrowserRouter>
  </Provider>
), document.getElementById('app'));
