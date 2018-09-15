var config = require('../../config');
// 引入babel-register，这是一个require钩子，会自动对require命令所加载的js文件进行实时转码，需要注意的是，这个库只适用于开发环境。
require('babel-register');

// 引入babel-polyfill这个库来提供regenerator运行时和core-js来模拟全功能ES6环境。
require('babel-polyfill');

// 因为在服务端, 不支持import、jsx这种语法，并且无法识别对css、image资源后缀的模块引用
// 引入css-modules-require-hook，同样是钩子，只针对样式文件，由于我们采用的是CSS Modules方案，并且使用SASS来书写代码，所以需要node-sass这个前置编译器来识别扩展名为.scss的文件，当然你也可以采用LESS的方式，通过这个钩子，自动提取className哈希字符注入到服务端的React组件中。
require('css-modules-require-hook')({
  generateScopedName: config.class_scoped_name,
  extensions: ['.scss', '.css']
});
require('./server');
