import React from 'react';
import PropTypes from 'prop-types';

import { name, domain_name } from '../../../config';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {loadPostsList} from '../../actions/posts';
import { getPostsListByListId } from '../../reducers/posts';

import { loadCommentList } from '../../actions/comments';
import { getCommentListById } from '../../reducers/comments';

// http://blog.csdn.net/ISaiSai/article/details/78094556
import {withRouter} from 'react-router-dom';

//import PostsDetailBlock from '../../components/posts/detail';

// 壳组件
import Shell from '../../components/shell';
import Meta from '../../components/meta';

let generalArgs = {
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false,
};

@connect(
    (state, props) => ({
        posts: getPostsListByListId(state, props.match.params.id),
    }),
    (dispatch) => ({
        loadPostsList: bindActionCreators(loadPostsList, dispatch),
    })
)
@withRouter
export class PostsDetail extends React.Component {

    // 服务端渲染
    // 加载需要在服务端渲染的数据
    static loadData({store, match}) {
        return new Promise(async function(resolve, reject) {

            /* 敲黑板～ 这里是重点～～～～～～～～～～～（为了引起你的注意，我写了这句话） */

            /**
            * 这里的 loadPostsList 方法，是在服务端加载 posts 数据，储存到 redux 中。
            * 这里对应的组件是 PostsList，PostsList组件里面也有 loadPostsList 方法，但它是在客户端执行。
            * 然后，服务端在渲染 PostsList 组件的时候，我们会先判断如果redux中，是否存在该条数据，如果存在，直接拿该数据渲染
            */

            //await loadPostsList({ id: 'home', args: generalArgs })(store.dispatch, store.getState);
            const { id } = match.params;
            const [err, data] = await loadPostsList({
                id: id,
                filters: {
                    variables: {
                        _id: id,
                        deleted: false,
                    }
                }
            })(store.dispatch, store.getState);

            if (data && data.data && data.data.length > 0) {
                resolve({ code: 200})
            }
            else {
                resolve({ code: 404, text: '该帖子不存在'});
            }
        })
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { filters, posts, loadPostsList } = this.props;
        const { id } = this.props.match.params;
        console.log(posts);

        let err, data;

        if (!posts || !posts.data) {
            [err, data] = await loadPostsList({
                id,
                filters: {
                    variables: {
                        _id: id,
                        deleted: false,
                    }
                }
            })
        }

        console.log('data', data);
        if (data && data.data && !data.data[0]) {
            this.props.notFoundPage('该帖子不存在');
        }
    }

    render() {
        return (
            <div>

                <Meta title="首页"/>

                <div>PostsDetail</div>

            </div>
        )
    }
}

export default Shell(PostsDetail);
