import React from 'react';
import PropTypes from 'prop-types';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';

import {fade} from '@material-ui/core/styles/colorManipulator';

const materialStyles = theme => ({
    pcDisplay: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    mbDisplay: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        }
    },
    search: {
        position: 'relative',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bdbdbd',
        borderRadius: '50px',
        backgroundColor: fade('#000000', 0),
        '&:hover': {
            backgroundColor: fade('#000000', 0.1)
        },
        color: '#000000',
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing.unit * 5,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit',
        width: '100%'
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 5,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200
            }
        }
    },
    icon: {
        margin: theme.spacing.unit
    }
});

@withStyles(materialStyles)
@CSSModules(styles)
export class SearchSection extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,

    }

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    ChangeHandler(event) {
        this.setState({
            value: event.target.value
        })
    }

    KeyUpHandler(event) {
        if (event.keyCode !== 13) {
            return
        }
        console.log(`enter: ${this.state.value}`);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.pcDisplay}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <Input
                            placeholder="搜索…"
                            disableUnderline={true}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput
                            }}
                            onChange={this.ChangeHandler.bind(this)}
                            onKeyUp={this.KeyUpHandler.bind(this)}
                            />
                    </div>
                </div>
                <div className={classes.mbDisplay}>
                    <IconButton color='primary'>
                        <Icon
                            className={classNames(classes.icon, 'fas fa-search')} />
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default SearchSection;
