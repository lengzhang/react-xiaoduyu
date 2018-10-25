import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import DetailBlock from '../detail-block';
import CommentsList from '../comment-list';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

const materialStyles = theme => ({
    container: {
        maxWidth: theme.spacing.unit*90,
            width: '100%',
        [theme.breakpoints.down('xs')]: {
            maxWidth: '90%',
        }
    },
});

@withStyles(materialStyles)
export class PostsDetailBlock extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        posts: PropTypes.object.isRequired,
    }

    static defaultProps = {

    }

    constructor(props) {
        super(props);
    }

    render() {
        const { classes, posts } = this.props;

        return (
            <div className={classes.container}>
                <Grid container spacing={24} direction='column' justify='flex-start'>
                    <Grid item><DetailBlock posts={posts} /></Grid>
                    <Grid item><CommentsList id={posts._id} /></Grid>
                </Grid>
            </div>
        )
    }
}

export default PostsDetailBlock;
