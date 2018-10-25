import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import HTMLText from '../../html-text';
import LikeButton from '../../like-button';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const materialStyles = theme => ({
    listItemHeader: {
        padding: 0,
    },
    removePaddingY: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    reply: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        color: '#9E9E9E',
    },
    card: {
        width: '100%',
    },
    cardContent: {
        paddingTop: 0,
        'padding-bottom': 0,
    },
    cardActions: {
        padding: 0,
        paddingLeft: theme.spacing.unit*2,
        paddingRight: theme.spacing.unit*2,
    },
});

@withStyles(materialStyles)
export class CommentItem extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        comment: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {classes, comment} = this.props;

        const header = (data) => (
            <CardHeader
                avatar={
                    <Avatar
                        alt={data.user_id.nickname}
                        src={data.user_id.avatar_url}
                        />
                }
                title={
                    <div>
                        {data.user_id.nickname}
                        {
                            data.reply_id
                            ?
                            <span>
                                <span className={classes.reply}>
                                    回复
                                </span>
                                {data.reply_id.user_id.nickname}
                            </span>
                            :
                            null
                        }
                    </div>
                }
                subheader={
                    <Grid container spacing={8} justify='flex-start'>
                        <Grid item>{data._create_at}</Grid>
                        {data.like_count > 0 ? <Grid item>•</Grid> : ''}
                        {data.like_count > 0 ? <Grid item>赞 {data.like_count}</Grid> : ''}
                        {data.reply_count > 0 ? <Grid item>•</Grid> : ''}
                        {data.reply_count > 0 ? <Grid item>回复 {data.reply_count}</Grid> : ''}
                    </Grid>
                }
                />
        )

        return (
            <Card className={classes.card}>
                {header(comment)}
                <CardContent className={classes.cardContent}>
                    <HTMLText content={comment.content_html}/>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Grid container spacing={8} direction='row' justify='flex-start'>
                        <Grid item>
                            <LikeButton comment={comment} />
                        </Grid>
                    </Grid>
                </CardActions>
                {
                    comment.reply_count > 0
                    ?
                    <CardContent className={classes.cardContent}>
                        {
                            comment.reply.map((subComment, index) => (
                                <Card key={index} className={classes.card}>
                                    {header(subComment)}
                                    <CardContent className={classes.cardContent}>
                                        <HTMLText content={subComment.content_html}/>
                                    </CardContent>
                                    <CardActions className={classes.cardActions}>
                                        <Grid container spacing={8} direction='row' justify='flex-start'>
                                            <Grid item>
                                                <LikeButton comment={subComment} />
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            ))
                        }
                    </CardContent>
                    :
                    null
                }
            </Card>
        )
    }
}
/*
<List disablePadding>
    <ListItem className={classes.listItemHeader}>
        <ListItemAvatar>
            <Avatar
                alt={comment.user_id.nickname}
                src={comment.user_id.avatar_url}
                />
        </ListItemAvatar>
        <ListItemText
            primary={comment.user_id.nickname}
            secondary={`
                ${comment.like_count > 0 ? `赞 ${comment.like_count}` : ''}
                ${comment.like_count > 0 && comment.reply_count > 0 ? '  •  ' : ''}
                ${comment.reply_count > 0 ? `回复 ${comment.reply_count}` : ''}
                ${comment.like_count > 0 || comment.reply_count > 0 ? '  •  ' : ''}
                ${comment._create_at}
            `}
            />
    </ListItem>
    <ListItem>
        <HTMLText content={comment.content_html}/>
    </ListItem>
    {
        comment.reply_count > 0
        ?
        comment.reply.map((item, index) => (
            <ListItem key={index}>
                <List disablePadding>
                    <ListItem className={classes.listItemHeader}>
                        <Avatar
                            alt={item.user_id.nickname}
                            src={item.user_id.avatar_url}
                            />
                        <ListItemText
                            primary={
                                <div>
                                    {item.user_id.nickname}
                                    <span className={classes.reply}>
                                        回复
                                    </span>
                                    {item.reply_id.user_id.nickname}
                                </div>
                            }
                            secondary={`
                                ${comment.like_count > 0 ? `赞 ${comment.like_count}` : ''}
                                ${comment.like_count > 0 && comment.reply_count > 0 ? '  •  ' : ''}
                                ${comment.reply_count > 0 ? `回复 ${comment.reply_count}` : ''}
                                ${comment.like_count > 0 || comment.reply_count > 0 ? '  •  ' : ''}
                                ${comment._create_at}
                            `}
                            />
                    </ListItem>
                    <ListItem>
                        <HTMLText content={item.content_html}/>
                    </ListItem>
                </List>
            </ListItem>
        ))
        :
        null
    }
</List>*/

export default CommentItem;
