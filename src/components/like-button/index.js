import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { like, unlike } from '../../actions/like';

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
    (state, props) => ({ }),
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
    }

    handleLike = async () => {
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
        console.log(err, res);
    }

    render() {
        const { classes, posts, comment, reply } = this.props;
        const target = posts || comment || reply;

        return (
            <Tooltip title={target.like ? '取消点赞' : '点赞'} placement='bottom' disableTouchListener={true}>
                <IconButton aria-label="Like" onClick={this.handleLike}>
                    <ThumbUp color={target.like ? 'secondary' : 'inherit'}/>
                </IconButton>
            </Tooltip>
        )
    }
}

export default LikeButton;
