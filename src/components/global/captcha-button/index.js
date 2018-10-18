import React, { Component } from 'react';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCaptcha } from '../../../actions/captcha';

import MessageBar from '../message-bar';

// material-ui
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const materialStyles = theme => ({
    button: {
        padding: theme.spacing.unit,
    }
});

@connect(
    (state, props) => ({}),
    dispatch => ({
        addCaptcha: bindActionCreators(addCaptcha, dispatch)
    })
)
@withStyles(materialStyles)
export class CaptchaButton extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        sendCaptcha: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            countDown: 0,
            disabled: false,
            loading: false,
            msgOpen: false,
            msg: '',
            msgType: 'error',
        }
    }

    msgShow = (msg, msgType) => {
        this.setState({ msgOpen: true, msg, msgType })
    }

    msgClose = () => {
        this.setState({ msgOpen: false});
    }

    send = async () => {
        let { countDown, loading } = this.state;
        let data = this.props.sendCaptcha();
        if (!data || loading || countDown > 0) return;

        // Start Loading
        this.setState({ loading: true });
        let [ err, res ] = await this.props.addCaptcha(data);

        if (err) {
            this.msgShow(err.message, 'error');
            this.setState({loading: false});
            return;
        }
        else {
            this.msgShow('验证码发送成功', 'success');
        }

        this.setState({ disabled: true, countDown: 60, loading: false }, () => {

            // Send success, start count down
            let run = () => {
                if (this.state.countDown === 0) {
                    this.setState({
                        disabled: false,
                        loading: false,
                    });
                    return;
                }
                this.setState({ countDown: this.state.countDown - 1});
                setTimeout(() => { run(); }, 1000);
            };

            run();
        });
    }

    render() {
        const { classes } = this.props;
        const { countDown, disabled, msgOpen, msg, msgType } = this.state;
        return (
            <div>
                <Button
                    className={classes.button}
                    color='default'
                    disabled={disabled}
                    fullWidth
                    onClick={this.send}
                    size='large'
                    variant='outlined'
                    >
                    {countDown > 0 ? `发送成功 (${countDown})` : '获取验证码'}
                </Button>
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
        )
    }
}

export default CaptchaButton;
