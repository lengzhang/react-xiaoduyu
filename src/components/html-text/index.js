import React from 'react';
import PropTypes from 'prop-types';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

import Device from '../../common/device';
import Utils from '../../common/utils';

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (let i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

const linkOptimization = (html) => {

    if (!html) return '';

    html = html.replace('&nbsp;', ' ');

    let imgReg = /<a(.*?)>(.*?)<\/a>/gi;

    let aList = [];
    let arr = html.match(imgReg);

    if (arr && arr.length > 0) {
        html.match(imgReg).map(item => {
            let id = '#' + randomString(18) + '#';

            aList.push({id, value: item});

            html = html.replace(item, id);
        });
    }

    let linkReg = /(http:\/\/|https:\/\/|www\.|magnet\:\?xt\=)(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

    let links = html.match(linkReg);

    if (links && links.length > 0) {

        function sortNumber(a, b) {
            return b.length - a.length;
        }

        links = links.sort(sortNumber);

        let _links = [];

        links.map(item => {

            let id = '#' + randomString(18) + '#';

            _links.push({id, value: item})
            html = html.replace(item, id);
        });

        _links.map(item => {
            if (Device.isMobileDevice()) {
                html = html.replace(item.id, `<a href=${item.value} rel="nofollow">${item.value}</a>`);
            } else {
                html = html.replace(item.id, `<a href=${item.value} target="_blank" rel="nofollow">${item.value}</a>`);
            }

        })

    }

    if (aList.length > 0) {
        aList.map(item => {
            html = html.replace(item.id, item.value);
        })
    }

    return html;
}

const imageOptimization = (html) => {
    // 图片处理
    let re = /\<img src\=\"(.*?)\"\>/g;

    let imgs = [...new Set(html.match(re))];

    // 获取页面中所有的图片
    let allImage = Utils.abstractImagesFromHTML(html);
    allImage.map((item, index) => {
        allImage[index] = item.split('?')[0];
    });
    allImage = "['" + allImage.join("','") + "']";

    if (imgs && imgs.length > 0) {

        imgs.map((img, index) => {

            let _img = img;

            // 如果url中包含“?”,需要将其转译成字符串
            _img = _img.replace(/\?/g, "\\?");

            html = html.replace(new RegExp(_img, "gm"), '<div onclick="webPictureViewer(' + allImage + ',' + index + ');" class="load-demand text-center" data-load-demand=\'' + img + '\'></div>');
        })
    }
    return html;
}

const videoOptimization = (html) => {
    // youku
    let re = /\<div data\-youku\=\"(.*?)\"\>\<\/div\>/g
    let videos = html.match(re)

    // console.log(videos);

    if (videos && videos.length > 0) {

        // console.log(videos);

        videos.map(div => {

            const id = div.split(re)[1];

            // let url = "http://player.youku.com/player.php/sid/"+id+"/v.swf"
            // let media = `<embed ref="embed" src="${url}"></embed>`

            // if (Device.isMobileDevice()) {
            let url = "//player.youku.com/embed/" + id
            let media = `<iframe ref="iframe" src="${url}"></iframe>`
            // }

            html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
        })
    }

    // qq
    re = /\<div data\-qq\=\"(.*?)\"\>\<\/div\>/g
    videos = html.match(re)

    if (videos && videos.length > 0) {
        videos.map(div => {

            const id = div.split(re)[1]

            // let url = "http://static.video.qq.com/TPout.swf?vid="+id+"&auto=0"
            // let media = `<embed ref="embed" src="${url}"></embed>`

            // if (Device.isMobileDevice()) {
            let url = "//v.qq.com/iframe/player.html?vid=" + id + "&tiny=0&auto=0"
            let media = `<iframe ref="iframe" src="${url}"></iframe>`
            // }

            html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
        })
    }

    // youtube
    re = /\<div data\-youtube\=\"(.*?)\"\>\<\/div\>/g
    videos = html.match(re)

    if (videos && videos.length > 0) {

        videos.map(div => {

            const id = div.split(re)[1]

            let url = "//www.youtube.com/embed/" + id
            let media = `<iframe ref="iframe" src="${url}"></iframe>`

            html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
        })

    }
    return html
}

const musicOptimization = (html) => {
    // music
    let re = /\<div data\-163musicsong\=\"(.*?)\"\>/g
    let musics = html.match(re)

    if (musics && musics.length > 0) {

        musics.map(div => {
            const id = div.split(re)[1]
            let url = "//music.163.com/outchain/player?type=2&id=" + id + "&auto=0&height=66"
            html = html.replace(div, `<iframe type="music" ref="iframe" src="${url}" height="86"></iframe>`)
        })

    }

    re = /\<div data\-163musicplaylist\=\"(.*?)\"\>/g
    musics = html.match(re)

    if (musics && musics.length > 0) {

        musics.map(div => {
            const id = div.split(re)[1]
            let url = "//music.163.com/outchain/player?type=0&id=" + id + "&auto=0&height=430"
            html = html.replace(div, `<iframe type="music" ref="iframe" src="${url}" height="450"></iframe>`)
        });

    }

    return html;
}

const optimization = (html) => {
    html = linkOptimization(html);
    html = imageOptimization(html);
    html = videoOptimization(html);
    html = musicOptimization(html);
    return html;
}

@CSSModules(styles)
export class HTMLText extends React.Component {

    static propTypes = {
        content: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }
    }

    componentWillMount() {
        let { content } = this. props;
        this.state.content = optimization(content);
    }

    componentWillReceiveProps(props) {
        if (this.props.content != props.content) {
            this.props = props;
            this.componentWillMount();
        }
    }

    render() {
        const {content} = this.state;

        return (
            <div className={styles.content} dangerouslySetInnerHTML={{__html:content}}></div>
        )
    }
}

export default HTMLText;
