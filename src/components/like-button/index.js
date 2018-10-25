import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { like, unlike } from '../../actions/like';
import { isMember } from '../../reducers/user';

import MessageBar from '../global/message-bar';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import ThumbUp from '@material-ui/icons/ThumbUp';
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
        like: bindActionCreators(like, dispatch),
        unlike: bindActionCreators(unlike, dispatch),
    })
)
@withStyles(materialStyles)
export class LikeButton extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        posts: PropTypes.object,
        comment: PropTypes.object,
        reply: PropTypes.object,
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

    handleLike = async () => {
        if (!this.props.isMember) {
            this.msgOpen('请先登录', 'warning');
            return;
        }
        const { like, unlike } = this.props;
        const { posts, comment, reply } = this.props;
        const target = posts || comment || reply;
        const type = posts ? 'posts' : (comment ? 'comment' : 'reply');

        let err, res;

        if (target.like) {
            [ err, res ] = await unlike({
                type: type,
                target_id: target._id
            });
        }
        else {
            [ err, res ] = await like({
                type: type,
                target_id: target._id,
                mood: 1
            });
        }

        if (err) {
            this.msgOpen(err, 'error');
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
        const { classes, isMember, posts, comment, reply } = this.props;
        const target = posts || comment || reply;

        const { open, msg, variant } = this.state;

        return (
            <div>
                <Tooltip title={target.like ? '取消点赞' : '点赞'} placement='bottom' disableTouchListener={true}>
                    <div>
                        <IconButton aria-label="Like" onClick={this.handleLike}>
                            <ThumbUp fontSize="small" color={target.like ? 'secondary' : 'inherit'}/>
                        </IconButton>
                    </div>
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

/*

open: PropTypes.bool.isRequired,
message: PropTypes.string.isRequired,
onClose: PropTypes.func.isRequired,
vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
horizontal: PropTypes.oneOf(['left', 'center', 'right']),
autoHideDuration: PropTypes.number,
variant: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
*/
export default LikeButton;
