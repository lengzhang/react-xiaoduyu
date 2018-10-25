import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { loadCommentList } from '../../../actions/comment';
import { getCommentListById } from '../../../reducers/comment';

import classNames from 'classnames';

import HTMLText from '../../html-text';
import Loading from '../../ui/loading';
import CommentItem from '../comment-list-item';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const materialStyles = theme => ({
    container: {
        width: '100%',
    },
    cardHeader: {
        background: '#F5F5F5',
        padding: theme.spacing.unit,
    },
    divider: {
        marginBottom: theme.spacing.unit*2,
    }
});

@connect(
    (state, props) => ({
        commentsList: getCommentListById(state, props.id),
    }),
    (dispatch) => ({
        loadCommentList: bindActionCreators(loadCommentList, dispatch)
    })
)
@withStyles(materialStyles)
export class PostsDetailBlock extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
        commentsList: PropTypes.object.isRequired,
    }

    static defaultProps = {

    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { id, commentsList } = this.props;
        if (!commentsList || !commentsList.data) await this.loadData();
        ArriveFooter.add(`comment_${id}`, this.loadData);
    }

    componentWillUnmount() {
        const { id } = this.props;
        ArriveFooter.remove(`comment_${id}`);
    }

    componentWillReceiveProps(props) {
        if (props.id != this.props.id) {
            this.componentWillUnmount();
            this.props = props;
            this.componentDidMount();
        }
    }

    loadData = async (restart = false) => {
        const { id, loadCommentList } = this.props;
        await loadCommentList({
            name: id,
            filters: {
                variables: {
                    posts_id: id,
                    parent_id: 'not-exists',
                    page_size:10
                }
            },
            restart
        });
    }

    render() {
        const {classes, commentsList} = this.props;
        return (
            <Card className={classes.container}>
                <CardHeader
                    className={classes.cardHeader}
                    title={
                        commentsList.loading
                        ?
                        <h6>加载中, 请稍后...</h6>
                        :
                        (
                            commentsList.count > 0
                            ? <h6>{commentsList.count} 条评论</h6>
                            : <h6>没有评论</h6>
                        )
                    }
                    />
                {
                    commentsList.loading
                    ?
                    <Loading />
                    :
                    commentsList.count > 0
                    ?
                    <CardContent>
                        <List disablePadding>
                            {
                                commentsList.data.map((item, index) => (
                                    <ListItem key={index} disableGutters>
                                        <CommentItem comment={item} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </CardContent>
                    :
                    null
                }
            </Card>
        )
    }
}

export default PostsDetailBlock;
