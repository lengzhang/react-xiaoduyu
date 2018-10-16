import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { signIn } from '../../actions/sign';
import { getCaptchaById } from '../../reducers/captcha';
import { addCaptcha } from '../../actions/captcha';

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
            errorOpen: false,
            errorMsg: 'Error Bar',
        }
    }

    getCaptcha = () => {
        this.props.addCaptcha();
    }

    errorOpen = (msg) => {
        this.setState({
            errorOpen: true,
            errorMsg: msg,
        })
    }

    errorClose = () => {
        this.setState({
            errorOpen: false,
        })
    }

    render() {
        const { classes, modalType, modalOpen, handleModalClose, switchModal, signIn, captcha } = this.props;
        const { errorOpen, errorMsg } = this.state;
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
                                errorOpen={this.errorOpen}
                                />
                            :
                            <SignUpCard
                                handleModalClose={handleModalClose}
                                switchModal={switchModal}
                                signIn={signIn}
                                captcha={captcha}
                                getCaptcha={this.getCaptcha}
                                errorOpen={this.errorOpen}
                                />
                        }
                        <MessageBar
                            open={errorOpen}
                            message={errorMsg}
                            onClose={this.errorClose}
                            vertical='top'
                            horizontal='right'
                            autoHideDuration={5000}
                            variant='error'
                            />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default SignModal;
