import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import LikeButton from '../../like-button';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Grid from '@material-ui/core/Grid';

const materialStyles = theme => ({
    card: {
        width: '100%',
    },
    cardContent: {
        paddingTop: 0,
        'padding-bottom': 0,
    },
    cardActions: {
        padding: 0,
        paddingTop: theme.spacing.unit*2,
        paddingLeft: theme.spacing.unit*3,
        paddingRight: theme.spacing.unit*3,
    },
});

@withStyles(materialStyles)
export class PostsListItem extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        post: PropTypes.object.isRequired,
    }

    static defaultProps = {

    }

    constructor(props) {
        super(props);
    }

    render() {
        const { classes, post } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar
                            alt={post.user_id.nickname}
                            src={post.user_id.avatar_url}
                            />
                    }
                    title={
                        <Grid container direction="row" justify='space-between'>
                            <Grid item><h3>{post.user_id.nickname}</h3></Grid>
                            <Grid item><p>{post._create_at}</p></Grid>
                        </Grid>
                    }
                    subheader={
                        <Grid container spacing={24} justify='space-between'>
                            <Grid item>{post.topic_id.name}</Grid>
                            <Grid item>
                                <Grid container spacing={8} justify='flex-end'>
                                    {post.view_count > 0 ? <Grid item>{post.view_count} 次浏览</Grid> : ''}
                                    {post.view_count > 0 && post.like_count > 0 ? <Grid item>•</Grid> : ''}
                                    {post.view_count > 0 && post.like_count > 0 ? <Grid item>{post.like_count} 个赞</Grid> : ''}
                                    {post.view_count > 0 && post.like_count > 0 && post.follow_count > 0 ? <Grid item>•</Grid> : ''}
                                    {post.view_count > 0 && post.like_count > 0 && post.follow_count > 0 ? <Grid item>{post.follow_count} 人关注</Grid> : ''}
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    />
                <CardContent className={classes.cardContent}>
                    <Link to={`/posts/${post._id}`}>
                        <Grid container direction='column'>
                            <Grid item>{post.title}</Grid>
                            <Grid item>{post.content_summary}</Grid>
                        </Grid>
                    </Link>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <LikeButton post={post} />
                </CardActions>
            </Card>
        )
    }
}

export default PostsListItem;
