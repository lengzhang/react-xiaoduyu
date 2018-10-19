import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { loadPostsList } from '../../../actions/posts';
import { getPostsListByName } from '../../../reducers/posts';

import Loading from '../../ui/loading';
import PostsListItem from '../list-item';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

const materialStyles = theme => ({
    root: {
        width: '100%',
        maxWidth: theme.spacing.unit*90,
        [theme.breakpoints.down('xs')]: {
            maxWidth: '90%',
        }
    },
});

@connect(
    (state, props) => ({
        postsList: getPostsListByName(state, props.id)
    }),
    dispatch => ({
        loadPostsList: bindActionCreators(loadPostsList, dispatch)
    })
)
@withStyles(materialStyles)
export class PostsList extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
        args: PropTypes.object.isRequired,
    }

    static defaultProps = {

    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { id, args, postsList, loadPostsList } = this.props;
        if (!postsList.data) {

            console.log('id', id);
            console.log('args', args);
            console.log('postsList', postsList);
            await loadPostsList({ id, args });
        }
        ArriveFooter.add(id, async () => {
            await loadPostsList({ id, args });
        })
    }

    componentWillUnmount() {
        ArriveFooter.remove(this.props.id)
    }

    render() {
        const { classes, postsList } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={24} direction='column' justify='center'>
                    {
                        postsList.data.map((item, index) => (
                            <Grid item key={index}>
                                <PostsListItem posts={item} />
                            </Grid>
                        ))
                    }
                </Grid>
                {postsList.loading ? <Loading /> : null}
            </div>
        )
    }
}

export default PostsList;
