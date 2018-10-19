import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { follow, unfollow } from '../../actions/follow';

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
    (state, props) => ({ }),
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
    }

    handleFollow = (status) => async () => {
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

        /*

            const { follow, posts, user, topic  } = this.props

            let args = {};
            if (posts) args.posts_id = posts._id;
            if (user) args.user_id = user._id;
            if (topic) args.topic_id = topic._id;

            await follow({ args });
        */

        let err, res;

        // if (target.like) {
        //     [ err, res ] = await unlike({
        //         type: type,
        //         target_id: target._id
        //     });
        // }
        // else {
        //     [ err, res ] = await like({
        //         type: type,
        //         target_id: target._id,
        //         mood: 1
        //     });
        // }
        console.log(err, res);
    }

    render() {
        const { classes, posts, comment, reply } = this.props;
        const target = posts || user || topic;

        return (
            <Tooltip title={target.follow ? '取消关注' : '关注'} placement='bottom' disableTouchListener={true}>
                <IconButton aria-label="Like" onClick={this.handleFollow(target.follow)}>
                    <StarIcon color={target.follow ? 'secondary' : 'inherit'}/>
                </IconButton>
            </Tooltip>
        )
    }
}

export default FollowButton;
