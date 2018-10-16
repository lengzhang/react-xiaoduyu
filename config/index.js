// 生产环境配置
let config = {

    name: '小度鱼',

    // 添加内容到模版的head中
    head: `
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
    `,

    // Material UI
    // Roboto Font
    // Font Icons
    material_ui_head: `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    `,

    // Font Awesome
    font_awesome_head: `
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    `,

    // 正式环境
    debug: false,

    // 域名
    host: 'localhost',

    // 域名全地址
    domain_name: 'http://localhost:4000',

    //  服务端口
    port: 4000,

    // 登录 token cookie 的名称
    auth_cookie_name: 'xiaoduyu',

    // https://github.com/css-modules/css-modules
    class_scoped_name: '[hash:base64:8]',

    // 前端打包后，静态资源路径前缀
    // 生成效果如：//localhost:4000/app.bundle.js
    public_path: '//localhost:4000',

    // graphql api 地址
    graphql_url: 'https://api.xiaoduyu.com/graphql',

    // websocket 链接地址
    socket_url: 'https://api.xiaoduyu.com',
}

// 开发环境配置
if (process.env.NODE_ENV == 'development') {
    config.debug = true
    config.class_scoped_name = '[name]_[local]__[hash:base64:5]'
}

module.exports = config
