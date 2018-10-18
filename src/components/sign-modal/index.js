import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { signIn, signUp } from '../../actions/sign';
import { getCaptchaById } from '../../reducers/captcha';
import { addCaptcha } from '../../actions/captcha';
import { loadCountries } from '../../actions/countries';

import classNames from 'classnames';

import SignInCard from './sign-in';
import SignUpCard from './sign-up';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import MessageBar from '../global/message-bar';

const materialStyles = theme => ({
    modalContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        'flex-direction': 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    card: {
        width: '100%',
        maxWidth: theme.spacing.unit * 50,
        [theme.breakpoints.down('xs')]: {
            maxWidth: theme.spacing.unit * 40,
        }
    },
});

@connect(
    (state, props) => ({
        captcha: getCaptchaById(state, 'sign-in')
    }),
    (dispatch) => ({
        signIn: bindActionCreators(signIn, dispatch),
        signUp: bindActionCreators(signUp, dispatch),
        addCaptcha: ()=>{
            return bindActionCreators(addCaptcha, dispatch)({
                id: 'sign-in',
                args: {
                    type: 'sign-in'
                },
                fields: `
                    success
                    _id
                    url
                `
            })
        },
        loadCountries: bindActionCreators(loadCountries, dispatch),
    })
)
@withStyles(materialStyles)
export class SignModal extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        modalType: PropTypes.string.isRequired,
        modalOpen: PropTypes.bool.isRequired,
        handleModalClose: PropTypes.func.isRequired,
        switchModal: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            msgType: 'info',
            msgOpen: false,
            msg: 'Message Bar',
            msgAutoHideDuration: 5000,
        }
    }

    componentDidMount() {
        this.props.loadCountries();
    }

    getCaptcha = () => {
        this.props.addCaptcha();
    }

    msgOpen = ({msg, type = 'info', duration = 5000}) => {
        this.setState({
            msgType: type,
            msgOpen: true,
            msg,
            msgAutoHideDuration: duration,
        })
    }

    msgClose = () => {
        this.setState({
            msgType: 'info',
            msgOpen: false,
            msg: 'Message Bar',
            msgAutoHideDuration: 5000,
        })
    }

    render() {
        const { classes, modalType, modalOpen, handleModalClose, switchModal, signIn, signUp, captcha } = this.props;
        const { msgType, msgOpen, msg } = this.state;
        return (
            <div>
                <Modal open={modalOpen} >
                    <div className={classes.modalContainer}>
                        {
                            modalType === 'sign-in'
                            ?
                            <SignInCard
                                handleModalClose={handleModalClose}
                                switchModal={switchModal}
                                signIn={signIn}
                                captcha={captcha}
                                getCaptcha={this.getCaptcha}
                                msgOpen={this.msgOpen}
                                />
                            :
                            <SignUpCard
                                handleModalClose={handleModalClose}
                                switchModal={switchModal}
                                signIn={signIn}
                                signUp={signUp}
                                captchaState={captcha}
                                getCaptcha={this.getCaptcha}
                                msgOpen={this.msgOpen}
                                />
                        }
                        <MessageBar
                            open={msgOpen}
                            message={msg}
                            onClose={this.msgClose}
                            vertical='top'
                            horizontal='right'
                            autoHideDuration={5000}
                            variant={msgType}
                            />
                    </div>
                </Modal>
            </div>
        )
    }
}

/*
{
    modalType === 'sign-in'
    ?
    <SignInCard
        handleModalClose={handleModalClose}
        switchModal={switchModal}
        signIn={signIn}
        captcha={captcha}
        getCaptcha={this.getCaptcha}
        errorOpen={this.errorOpen}
        />
    :
    <SignUpCard
        handleModalClose={handleModalClose}
        switchModal={switchModal}
        signUp={signUp}
        captcha={captcha}
        getCaptcha={this.getCaptcha}
        errorOpen={this.errorOpen}
        />
}
*/

export default SignModal;
