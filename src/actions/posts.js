import graphql from '../common/graphql';
import loadList from '../common/graphql/load-list';
import merge from 'lodash/merge'
import { DateDiff } from '../common/date';

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type, callback = ()=>{} }) {
    return (dispatch, getState) => {

        return new Promise(async resolve => {

            let [err, res] = await graphql({
                type: 'mutation',
                api: 'addPosts',
                args: {
                    title,
                    content: detail,
                    content_html: detailHTML,
                    topic_id: topicId,
                    device_id: device,
                    type
                },
                fields: `
                    success
                    _id
                `,
                headers: {
                    accessToken: getState().user.accessToken
                }
            });
            resolve([err, res]);
        })
    }
}

export function loadPostsList({ id, args, restart = false }) {
    return async (dispatch, getState) => {
        let fields = `
            _id
            comment_count
            content_html
            create_at
            deleted
            device
            follow_count
            ip
            last_comment_at
            like_count
            recommend
            sort_by_date
            title
            topic_id{
              _id
              name
            }
            type
            user_id{
              _id
              nickname
              brief
              avatar_url
            }
            verify
            view_count
            weaken
            follow
            like
        `;
        return await loadList({
            dispatch,
            getState,

            reducerName: 'posts',
            name: id,
            actionType: 'SET_POSTS_LIST',
            restart,
            args,
            fields,
            schemaName: 'posts',

            processList: processPostsList,
        })
    }
}

const processPostsList = (list) => {
    list.map((posts) => {
        if(posts.content_html) {
            // 提取内容中所有的图片地址
            posts.images = abstractImages(posts.content_html);

            // 设置第一张图为 cover image
            if (posts.images && posts.images.length > 0) {
                posts.coverImage = posts.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
            }

            // 将内容生产140的简介
            let textContent = posts.content_html;

            // let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
            let imgReg = /<img(.*?)>/gi;

            let imgs = [];
            let img;
            while (img = imgReg.exec(textContent)) {
                imgs.push(img[0]);
            }

            imgs.map(item=>{
                textContent = textContent.replace(item, '[图片] ');
            });

            // 删除所有html标签
            textContent = textContent.replace(/<[^>]+>/g,"");

            if (textContent.length > 140) textContent = textContent.slice(0, 140)+'...';
            posts.content_summary = textContent;

            // 获取内容中所有的图片
            posts.content_html = imageOptimization(posts.content_html);
        }

        if (posts.create_at) posts._create_at = DateDiff(posts.create_at);
        if (posts.sort_by_date) posts._sort_by_date = DateDiff(posts.sort_by_date);
        if (posts.last_comment_at) posts._last_comment_at = DateDiff(posts.last_comment_at);
    })
    return list
}

const abstractImages = (str) => {

    let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

    let result = [];
    let img;
    while (img = imgReg.exec(str)) {
        let _img = img[0].match(srcReg)
        if (_img && _img[1]) {
            _img = _img[1] + '?imageView2/2/w/800/auto-orient/format/jpg'
            result.push(_img)
        }
    }
    return result
}

// 图像优化，给html中的img图片，增加一些七牛参数，优化最大宽度，格式等
const imageOptimization = (str) => {

    let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

    let result = [];
    let img;
    while (img = imgReg.exec(str)) {
        let oldImgDom = img[0];

        if (oldImgDom) {

            let _img = oldImgDom.match(srcReg);

            if (_img && _img[1]) {
                let newImg = oldImgDom.replace(_img[1], _img[1] + '?imageView2/2/w/800/auto-orient/format/jpg');
                str = str.replace(oldImgDom, newImg);
            }

        }

    }

    return str

}
