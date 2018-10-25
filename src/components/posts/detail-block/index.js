import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import HTMLText from '../../html-text';

import LikeButton from '../../like-button';
import FollowButton from '../../follow-button';
import ShareButton from '../../share-button';

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
        padding: theme.spacing.unit,
        paddingLeft: theme.spacing.unit*3,
        paddingRight: theme.spacing.unit*3,
    },
});

@withStyles(materialStyles)
export class DetailBlock extends React.Component {

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
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar
                            alt={posts.user_id.nickname}
                            src={posts.user_id.avatar_url}
                            />
                    }
                    title={
                        <Grid container direction="row" justify='space-between'>
                            <Grid item><h3>{posts.user_id.nickname}</h3></Grid>
                            <Grid item><p>{posts._create_at}</p></Grid>
                        </Grid>
                    }
                    subheader={
                        <Grid container spacing={24} justify='space-between'>
                            <Grid item>{posts.topic_id.name}</Grid>
                            <Grid item>
                                <Grid container spacing={8} justify='flex-end'>
                                    {posts.view_count > 0 ? <Grid item>{posts.view_count} 次浏览</Grid> : ''}
                                    {posts.view_count > 0 && posts.like_count > 0 ? <Grid item>•</Grid> : ''}
                                    {posts.like_count > 0 ? <Grid item>{posts.like_count} 个赞</Grid> : ''}
                                    {(posts.view_count > 0 || posts.like_count > 0) && posts.follow_count > 0 ? <Grid item>•</Grid> : ''}
                                    {posts.follow_count > 0 ? <Grid item>{posts.follow_count} 人关注</Grid> : ''}
                                    {(posts.view_count > 0 || posts.like_count > 0 || posts.follow_count > 0) && posts.comment_count > 0 ? <Grid item>•</Grid> : ''}
                                    {posts.comment_count > 0 ? <Grid item>{posts.comment_count} 条评论</Grid> : ''}
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    />
                <CardContent className={classes.cardContent}>
                    <Grid container spacing={16} direction='column' justify='space-between'>
                        <Grid item><h3>{posts.title}</h3></Grid>
                        <Grid item><HTMLText content={posts.content_html}/></Grid>
                    </Grid>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Grid container spacing={8} direction='row' justify='flex-end'>
                        <Grid item><LikeButton posts={posts} /></Grid>
                        <Grid item><FollowButton posts={posts} /></Grid>
                        <Grid item><ShareButton posts={posts} /></Grid>
                    </Grid>
                </CardActions>
            </Card>
        )
    }
}

export default DetailBlock;
