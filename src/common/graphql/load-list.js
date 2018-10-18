import graphql from './index';
import merge from 'lodash/merge'

export default ({
    dispatch,
    getState,

    reducerName,
    name,
    actionType,
    restart,
    args,
    fields,
    schemaName = '',

    processList = data => data,
    callback = () => {}
}) => {
    return new Promise(async (resolve, reject) => {
        let state = getState(),
            list = state[reducerName][name] || {};

        // 重新加载列表
        if (restart) list = {};

        // 判断 list 中是否有 `more`, 有而且 more = false, 已经加载所有
        if (Reflect.has(list, `more`) && !list.more) {
            resolve([null, list]);
            return;
        }

        // 如果正在加载中，则阻止本次请求
        if (list.loading) return;

        // 构建 'data' 数组
        if (!Reflect.has(list, 'data')) list.data = [];

        // 判断是否存在筛选条件
        if (!Reflect.has(list, 'args')) {
            // 从第一页开始
            if (!Reflect.has(args, 'page_number')) args.page_number = 1;
            // 每页 post 的数量
            if (!Reflect.has(args, 'page_size')) args.page_size = 25;
            args.page_number = parseInt(args.page_number);
            args.page_size = parseInt(args.page_size);
            list.args = args;
        }
        else {
            // 进行翻页
            args = list.args;
            args.page_number += 1;
        }

        // 开始加载
        list.loading = true;
        if (actionType) await dispatch({ type: actionType, name, data: list });

        let [ err, data ] = await graphql({
            api: schemaName,
            args,
            fields,
            headers: { 'AccessToken': state.user.accessToken }
        })

        // 失败
        if (err) {
            list.loading = false;
            if (actionType) await dispatch({ type: actionType, name, data: list });
            resolve([null, list]);
            return;
        }

        list.data = list.data.concat(processList(merge([], data)));
        list.args = args;
        list.loading = false;

        // 如果列表不存在count，那么查询count
        if (!Reflect.has(list, 'count')) {
            let s = Object.assign({}, args);
            delete s.page_size;
            delete s.page_number;
            delete s.sort_by;

            let [ err, data ] = await graphql({
                api: 'count' + schemaName.charAt(0).toUpperCase() + schemaName.slice(1),
                args: s,
                fields: `count`,
                headers: { 'AccessToken': state.user.accessToken }
            })

            if (data) list.count = data.count;
        }

        list.more = list.args.page_size * list.args.page_number > list.count ? false : true;

        if (actionType) await dispatch({ type: actionType, name, data: list });

        resolve([null, list]);
    })
}
