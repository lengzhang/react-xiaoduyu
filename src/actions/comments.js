import graphql from '../common/graphql';
import loadList from '../common/graphql/graphql-load-list';
import merge from 'lodash/merge'
import { DateDiff } from '../common/date';

export function loadCommentsList({
    id,
    args,
    restart = false
}) {
    return async (dispatch, getState) => {
        let fields = `
        content_html
        create_at
        reply_count
        like_count
        device
        ip
        blocked
        deleted
        verify
        weaken
        recommend
        _id
        update_at
        like
        user_id {
            _id
            nickname
            brief
            avatar_url
        }
        posts_id{
            _id
            title
        }
        parent_id
        reply_id {
            _id
            user_id{
                _id
                nickname
                brief
                avatar_url
            }
        }
        reply {
            _id
            user_id {
                _id
                nickname
                brief
                avatar
                avatar_url
            }
            posts_id
            parent_id
            reply_id {
                user_id {
                    _id
                    nickname
                    brief
                    avatar
                    avatar_url
                }
            }
            update_at
            weaken
            device
            like_count
            create_at
            content_html
            like
        }
        `;
        return await loadList({
            dispatch,
            getState,

            reducerName: 'comments',
            name: id,
            actionType: 'SET_COMMENTS_LIST',
            restart,
            args,
            fields,
            schemaName: 'comments',

            processList: processCommentList,
        })
    }
}

const processCommentList = (list) => {
    list.map(item => {

        if (item.create_at) {
            item._create_at = DateDiff(item.create_at);
        }

        if (item.content_html) {
            let text = item.content_html.replace(/<[^>]+>/g, "");
            if (text.length > 200) text = text.slice(0, 200) + '...';
            item.content_summary = text;
        } else {
            item.content_summary = '';
        }

        if (item.reply && item.reply.map) {
            item.reply = processCommentList(item.reply);
        }

    })
    return list
}
