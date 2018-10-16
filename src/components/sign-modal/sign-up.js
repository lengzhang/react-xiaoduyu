import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CloseIcon from '@material-ui/icons/Close';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const materialStyles = theme => ({
    card: {
        width: '100%',
        maxWidth: theme.spacing.unit * 50,
        [theme.breakpoints.down('xs')]: {
            maxWidth: theme.spacing.unit * 40,
        }
    },
});

@withStyles(materialStyles)
export class SignUpCard extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        handleModalClose: PropTypes.func.isRequired,
        switchModal: PropTypes.func.isRequired,
        signIn: PropTypes.func.isRequired,
        captcha: PropTypes.object,
        getCaptcha: PropTypes.func.isRequired,
        errorOpen: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            account: {
                value: '',
                error: false,
                helperText: '',
                disabled: false,
            },
            password: {
                value: '',
                error: false,
                helperText: '',
                disabled: false,
                showPassword: false,
            },
            captchaState: {
                value: '',
                error: false,
                helperText: '',
                disabled: false,
            },
            signInButton: {
                name: '登录',
                disabled: false,
            }
        }
    }

    componentDidMount() {
        this.props.getCaptcha();
    }

    handleTextChange = (name) => (event) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], {value: `${event.target.value}`}),
        })
    }

    handleKeyUp = (event) => {
        if (event.keyCode === 13) this.signin(event);
    }

    handleToggleShowPassword = () => {
        this.setState({
            password: Object.assign({}, this.state.password, {showPassword: !this.state.password.showPassword}),
        })
    }

    signin = async (event) => {
        const { account, password, captchaState } = this.state;
        const { captcha } = this.props;
        let newAccount = {}, newPassword = {}, newCaptcha = {};
        if (account.value === '' && !account.error) {
            newAccount = {
                error: true,
                helperText: '请输入手机号或邮箱',
            }
        }
        else if (account.value != '' && account.error) {
            newAccount = {
                error: false,
                helperText: '',
            }
        }
        if (password.value === '' && !password.error) {
            newPassword = {
                error: true,
                helperText: '请输入密码',
            }
        }
        else if (password.value != '' && password.error) {
            newPassword = {
                error: false,
                helperText: '',
            }
        }
        if (captcha && captchaState.value === '' && !captchaState.error) {
            newCaptcha = {
                error: true,
                helperText: '请输入验证码',
            }
        }
        else if (captcha && captchaState.value != '' && captchaState.error) {
            newCaptcha = {
                error: false,
                helperText: '',
            }
        }
        if (Object.keys(newAccount).length > 0 || Object.keys(newPassword).length > 0 || Object.keys(captchaState).length > 0) {
            this.setState({
                account: Object.assign({}, this.state.account, newAccount),
                password: Object.assign({}, this.state.password, newPassword),
                captchaState: Object.assign({}, this.state.captchaState, newCaptcha),
                //signInButton: assign(this.state.signInButton, {name: '登录中...', disabled: true})
            })
        }

        if (account.value === '' || password.value === '' || (captcha && captchaState.value === '')) return;

        console.log('account', account);
        console.log('password', password);
        console.log('captchaState', captchaState);
        console.log('captcha', captcha);

        let data = {
            password: password.value
        }
        if (account.value.indexOf('@') != -1) {
            data.email = account.value;
        } else {
            data.phone = account.value;
        }
        if (captcha) {
            data.captcha = captchaState.value;
            data.captcha_id = captcha._id;
        }
        let [ err, result ] = await this.props.signIn({data});
        console.log('data', data);
        console.log(err, result);
        if (err) {
            this.props.errorOpen(err);
            this.props.getCaptcha();
        }
    }

    render() {
        const { classes, handleModalClose, switchModal, captcha, getCaptcha } = this.props;
        const { account, password, captchaState, signInButton} = this.state;
        console.log('captcha', captcha);
        return (
            <Card className={classes.card}>
                <CardHeader
                    title='注册'
                    action={
                        <IconButton onClick={handleModalClose}>
                            <CloseIcon />
                        </IconButton>
                    }
                    />
                <Divider />
                <CardContent>
                    <Grid container direction='column' spacing={8}>
                        <Grid item>
                            <TextField
                                id='account'
                                type='email'
                                label='手机号或邮箱'
                                placeholder='请输入手机号码或者邮箱地址'
                                value={account.value}
                                onChange={this.handleTextChange('account')}
                                onKeyUp={this.handleKeyUp}
                                error={account.error}
                                helperText={account.helperText}
                                disabled={account.disabled}
                                margin='dense'
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardContent>
                    已经有账号了? <Button
                        variant="contained"
                        color="primary"
                        onClick={switchModal}
                        >
                        登录
                    </Button>
                </CardContent>
            </Card>
        )
    }
}

export default SignUpCard;
