import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';

import SearchSection from './search-section';
import UserAvatar from '../user-avatar';

// material-ui
import withTheme from '../../material-ui-theme';
import {withStyles} from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Input from '@material-ui/core/Input';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const materialStyles = theme => ({
    root: {
        flexGrow: 1
    },
    appBar: {
        backgroundColor: '#ffffff'
    },
    container: {
        margin: theme.spacing.unit,
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: theme.spacing.unit * 100,
        height: theme.spacing.unit * 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        [theme.breakpoints.down('xs')]: {
            width: '90%',
            justifyContent: 'space-between',
            marginTop: theme.spacing.unit,
            marginBottom: theme.spacing.unit
        }
    },
    navItemGroup: {
        clear: 'both',
        width: 'auto',
        'justify-content': 'space-around',
        'align-items': 'baseline',
        'align-content': 'center'
    },
    currentPath: {
        color: '#2196f3',
    },
    navItem: {
        padding: 8,
        'padding-left': 24,
        'padding-right': 24,
        [theme.breakpoints.down('xs')]: {
            padding: 0,
            'padding-left': 8,
            'padding-right': 8
        }
    },
    sections: {
        marginLeft: 'auto'
    },
    buttonGroup: {
        padding: 0,

        Button: {
            margin: 0
        }
    },
    buttonLeft: {
        'border-top-right-radius': 0,
        'border-bottom-right-radius': 0
    },
    buttonRight: {
        'border-top-left-radius': 0,
        'border-bottom-left-radius': 0
    }
});

@withStyles(materialStyles)
@withTheme
export class Head extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        let index = 0;
        switch(this.props.location.pathname) {
            case '/follow': index =  0;
            break;
            case '/': index =  1;
            break;
            case '/zhiye': index =  2;
            break;
            case '/jishu': index =  3;
            break;
            case '/shenghuo': index =  4;
            break;
            case '/tangsuo': index =  5;
            break;
            default: index =  0;
        }
        this.state = {
            pathIndex: index
        };
    }

    handleTabs = (event, index) => {
        let path = '';
        switch(index) {
            case 0:
                path = 'follow';
                break;
            case 1:
                path = '/';
                break;
            case 2:
                path = 'zhiye';
                break;
            case 3:
                path = 'jishu';
                break;
            case 4:
                path = 'shenghuo';
                break;
            case 5:
                path = 'tangsuo';
                break;
            default:
                path = '/';
        }
        this.props.history.push(path);
    }

    render() {

        const {classes} = this.props

        const navItemsArr = [
            {
                path: '/follow',
                title: '关注'
            }, {
                path: '/',
                title: '发现'
            }, {
                path: '/zhiye',
                title: '职业'
            }, {
                path: '/jishu',
                title: '技术'
            }, {
                path: '/shenghuo',
                title: '生活'
            }, {
                path: '/tangsuo',
                title: '探索'
            }
        ]

        const navItem = (<Grid container spacing={8} className={classes.navItemGroup}>
            {
                navItemsArr.map((item, index) => {
                    return (<Grid item key={index}>
                        <NavLink to={item.path}>
                            <div className={this.state.pathIndex == index
                                    ? classes.currentPath
                                    : ""}>
                                {item.title}
                            </div>
                        </NavLink>
                    </Grid>)
                })
            }
        </Grid>)

        return (<header>
            <AppBar position="fixed" className={classes.appBar}>
                <Grid container className={classes.container}>
                    <Grid item className={classes.navItem}>
                        <NavLink to="/">
                            <h3>小度鱼</h3>
                        </NavLink>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item>
                            {navItem}
                        </Grid>
                    </Hidden>
                    <Grid item className={classes.sections}>
                        <Grid container spacing={16} justify="center" alignItems="baseline" alignContent="center">
                            <Grid item><SearchSection /></Grid>
                            <Grid item><UserAvatar /></Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Hidden smUp>
                    <Tabs value={this.state.pathIndex} onChange={this.handleTabs} indicatorColor="primary" textColor="primary">
                        {
                            navItemsArr.map((item, index) => {
                                return (<Tab key={index} label={item.title}/>)
                            })
                        }
                    </Tabs>
                </Hidden>
            </AppBar>
        </header>)

    }

}

export default Head;
