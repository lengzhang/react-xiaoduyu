import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { getProfile } from '../../reducers/user';
import { signOut } from '../../actions/sign';

import SignModal from '../sign-modal';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';

import Modal from '@material-ui/core/Modal';


const materialStyles = theme => ({
    button: {
        magin: theme.spacing.unit,
    },
    avatar: {
        magin: theme.spacing.unit,
        width: theme.spacing.unit*5,
        height: theme.spacing.unit*5,
    },
});

@connect(
    (state, props) => ({
        userProfile: getProfile(state)
    }),
    (dispatch) => ({
        signOut: bindActionCreators(signOut, dispatch)
    })
)
@withStyles(materialStyles)
export class UserAvatar extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        userProfile: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            modalOpen: false,
            modalType: 'sign-in',
        };
        this.handleSignIn = this.handleModalOpen.bind(this, 'sign-in');
        this.handleSignUp = this.handleModalOpen.bind(this, 'sign-up');
    }

    userButtonClick = () => {
        this.setState({
            menuOpen: true,
        })
    }

    handleMenuClose = () => {
        this.setState({
            menuOpen: false,
        })
    }

    handleModalOpen = (type = '') => {
        this.setState({
            menuOpen: false,
            modalType: type,
            modalOpen: true,
        })
    }

    handleModalClose = () => {
        this.setState({
            modalOpen: false,
        })
    }

    switchModal = () => {
        this.setState({
            modalType: this.state.modalType === 'sign-in' ? 'sign-up' : 'sign-in',
        })
    }

    render() {
        const { classes, userProfile, signOut } = this.props;
        const { menuOpen, modalOpen, modalType } = this.state;

        return (
            <div>
                {
                    userProfile
                    ?
                    <IconButton
                        color='primary'
                        aria-label='User'
                        onClick={this.userButtonClick}
                        buttonRef={(node)=>{this.anchorEl = node;}}
                        >
                        <Avatar
                            className={classes.avatar}
                            alt={userProfile.nickname}
                            src={userProfile.avatar_url}
                            />
                    </IconButton>
                    :
                    <IconButton
                        color='primary'
                        aria-label='User'
                        onClick={this.userButtonClick}
                        buttonRef={(node)=>{this.anchorEl = node;}}
                        >
                        <Icon className='far fa-user' />
                    </IconButton>
                }

                <Popover
                    open={menuOpen}
                    anchorEl={this.anchorEl}
                    onClose={this.handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    >
                    {
                        userProfile
                        ?
                        <Paper>
                            <MenuList>
                                <MenuItem onClick={this.handleSignIn}>个人中心</MenuItem>
                                <MenuItem onClick={this.handleSignIn}>设置</MenuItem>
                                <MenuItem onClick={signOut}>退出</MenuItem>
                            </MenuList>
                        </Paper>
                        :
                        <Paper>
                            <MenuList>
                                <MenuItem onClick={this.handleSignIn}>登陆</MenuItem>
                                <MenuItem onClick={this.handleSignUp}>注册</MenuItem>
                            </MenuList>
                        </Paper>
                    }
                </Popover>

                <SignModal
                    modalType={modalType}
                    modalOpen={modalOpen}
                    handleModalClose={this.handleModalClose}
                    switchModal={this.switchModal}
                    />
            </div>
        )
    }
}

export default UserAvatar;
