import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { follow, unfollow } from '../../actions/follow';
import { isMember } from '../../reducers/user';

import MessageBar from '../global/message-bar';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import StarIcon from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const materialStyles = theme => ({
    likeButton: {

    }
});

@connect(
    (state, props) => ({
        isMember: isMember(state),
    }),
    dispatch => ({
        follow: bindActionCreators(follow, dispatch),
        unfollow: bindActionCreators(unfollow, dispatch),
    })
)
@withStyles(materialStyles)
export class FollowButton extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        posts: PropTypes.object,
        user: PropTypes.object,
        topic: PropTypes.object,
    }

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            msg: '',
            variant: 'error',
        }
    }

    handleFollow = (status) => async () => {
        if (!this.props.isMember) {
            this.msgOpen('请先登录', 'warning');
            return;
        }

        const { posts, user, topic } = this.props;

        let args = {};
        if (posts) args.posts_id = posts._id;
        if (user) args.user_id = user._id;
        if (topic) args.topic_id = topic._id;

        if (status) {
            await this.props.unfollow({ args });
        }
        else {
            await this.props.follow({ args });
        }
    }

    msgOpen = (msg, variant) => {
        this.setState({
            open: true,
            msg,
            variant
        })
    }

    msgClose = () => {
        this.setState({
            open: false,
        })
    }

    render() {
        const { classes, posts, comment, reply } = this.props;
        const target = posts || user || topic;

        const { open, msg, variant } = this.state;

        return (
            <div>
                <Tooltip title={target.follow ? '取消关注' : '关注'} placement='bottom' disableTouchListener={true}>
                    <IconButton aria-label="Follow" onClick={this.handleFollow(target.follow)}>
                        <StarIcon color={target.follow ? 'secondary' : 'inherit'}/>
                    </IconButton>
                </Tooltip>
                <MessageBar
                    open={open}
                    message={msg}
                    onClose={this.msgClose}
                    vertical='top'
                    horizontal='right'
                    variant={variant}
                    />
            </div>
        )
    }
}

export default FollowButton;
