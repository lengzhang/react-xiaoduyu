import React from 'react';
import PropTypes from 'prop-types';

import { domain_name, name } from '../../../config';
import weixin from '../../common/weixin';

import MessageBar from '../global/message-bar';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import Slide from '@material-ui/core/Slide';
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const materialStyles = theme => ({
    likeButton: {

    }
});

@withStyles(materialStyles)
export class ShareButton extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        posts: PropTypes.object,
    }

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        const { posts } = props;
        this.state = {
            open: false,
            displayTips: false,
            showQRCode: false,
            url: `${domain_name}/posts/${posts._id}`,
            title: posts.title,
            summary: posts.content_summary,
            pics: posts.coverImage || '',
        }
    }

    handlePopover = (open) => () => {
        this.setState({
            open,
        })
    }

    shareToWeibo = () => {
        const { title, url } = this.state;
        window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');

    }

    shareToTwitter = () => {
        const { title, url } = this.state;
        window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
    }

    shareToQzone = () => {
        const { title, url, summary } = this.state;
        window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent('来自' + name + ' ' + domain_name)}&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=590,height=370');
    }

    shareToQQ = () => {
        const { title, url, summary, pics } = this.state;
        // ${pics ? '&pics='+encodeURIComponent('https://'+pics) : ''}
        window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${title}&desc=&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=770,height=620');
    }

    shareToWeiXin = () => {
        console.log(this.handleShowQRCode(true));
        if (weixin.in) {
            this.setState({
                displayTips: true,
            })
        } else {
            this.handleShowQRCode(true);
        }
    }

    handleDisplayTips = (displayTips) => () => {
        this.setState({
            displayTips,
        })
    }

    handleShowQRCode = (showQRCode) => () => {
        console.log('in', showQRCode);
        this.setState({
            showQRCode,
        })
    }

    render() {
        const { classes, posts } = this.props;
        const { open, displayTips, showQRCode } = this.state;

        return (
            <div>
                <div>
                    <Tooltip
                        title='分享'
                        placement='right-start'
                        disableTouchListener={true}
                        buttonRef={(node)=>{this.anchorEl = node;}}
                        >
                        <IconButton aria-label="Share" onClick={this.handlePopover(true)}>
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Popover
                        open={open}
                        anchorEl={this.anchorEl}
                        onClose={this.handlePopover(false)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        >
                        <Paper>
                            <MenuList>
                                {weixin.in ? null : <MenuItem onClick={this.shareToWeiXin && this.handlePopover(false)}>微信</MenuItem>}
                                <MenuItem onClick={this.shareToWeibo && this.handlePopover(false)}>微博</MenuItem>
                                <MenuItem onClick={this.shareToQzone && this.handlePopover(false)}>QQ空间</MenuItem>
                                <MenuItem onClick={this.shareToQQ && this.handlePopover(false)}>QQ好友和群组</MenuItem>
                                <MenuItem onClick={this.shareToTwitter && this.handlePopover(false)}>Twitter</MenuItem>
                            </MenuList>
                        </Paper>
                    </Popover>
                </div>
                <Dialog
                    open={showQRCode}
                    keepMounted
                    onClose={this.handleShowQRCode(false)}
                    >
                    <DialogContent>
                        <DialogContentText>abc</DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default ShareButton;
