import React from 'react';
import PropTypes from 'prop-types';

import Device from '../../common/device';

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
import CloseIcon from '@material-ui/icons/Close';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const materialStyles = theme => ({
    card: {
        width: '100%',
        maxWidth: theme.spacing.unit * 60,
        [theme.breakpoints.down('xs')]: {
            maxWidth: theme.spacing.unit * 40,
        }
    },
    switchButton: {
        marginLeft: theme.spacing.unit,
    },
});

@withStyles(materialStyles)
export class SignInCard extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        handleModalClose: PropTypes.func.isRequired,
        switchModal: PropTypes.func.isRequired,
        signIn: PropTypes.func.isRequired,
        captcha: PropTypes.object,
        getCaptcha: PropTypes.func.isRequired,
        msgOpen: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {account: {
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

    handleErrorTextField = (name, error, helperText) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], {
                error,
                helperText
            }),
        })
    }

    checkTextField = (name, helperText = '') => {
        const item = this.state[name];
        let newItem = {}
        if (item.value === '' && !item.error) {
            this.handleErrorTextField(name, true, helperText);
        }
        else if (item.value != '' && item.error) {
            this.handleErrorTextField(name, false, '');
        }
    }

    checkAccountFormat = (str) => {

        // Check Email Format
        let regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (regExp.test(str)) {
            this.handleErrorTextField('account', false, '');
            return true;
        }

        // Check Phone Format
        regExp = /\d+$/;
        if (regExp.test(str)) {
            this.handleErrorTextField('account', false, '');
            return true;
        }
        this.handleErrorTextField('account', true, '手机号码或邮箱地址格式不正确, 请重新输入');
        return false;
    }

    signin = async (event) => {
        const { account, password, captchaState } = this.state;
        const { captcha } = this.props;

        this.checkTextField('account', '请输入手机号码或邮箱');
        this.checkTextField('password', '请输入密码');
        if (captcha) this.checkTextField('captchaState', '请输入验证码');

        if (
            account.value === ''
            || (account.value != '' && !this.checkAccountFormat(account.value))
            || password.value === ''
            || (captcha && captchaState.value === '')
        ) return;

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

        this.setState({
            account: Object.assign({}, this.state.account, {disabled: true}),
            password: Object.assign({}, this.state.password, {disabled: true}),
            captchaState: Object.assign({}, this.state.captchaState, {disabled: true}),
            signInButton: Object.assign({}, this.state.signInButton, {name: '登录中...', disabled: true}),
        })

        let [ err, result ] = await this.props.signIn({data});

        if (err) {
            this.setState({
                account: Object.assign({}, this.state.account, {disabled: false}),
                password: Object.assign({}, this.state.password, {value: '', disabled: false}),
                captchaState: Object.assign({}, this.state.captchaState, {disabled: false}),
                signInButton: Object.assign({}, this.state.signInButton, {name: '登录', disabled: false})
            })
            this.props.msgOpen({msg: err, type: 'error'});
            this.props.getCaptcha();
        }
        else {
            this.setState({
                signInButton: Object.assign(this.state.signInButton, {name: '登录成功'})
            })
        }
    }

    render() {
        const { classes, handleModalClose, switchModal, captcha, getCaptcha } = this.props;
        const { account, password, captchaState, signInButton } = this.state;

        const textField = ({name, type = 'text', label, placeholder, InputProps = {}}) => {
            const item = this.state[name];
            return (
                <Grid item>
                    <TextField
                        id={name}
                        type={type}
                        label={label}
                        placeholder={placeholder}
                        value={item.value}
                        onChange={this.handleTextChange(name)}
                        onKeyUp={this.handleKeyUp}
                        error={item.error}
                        helperText={item.helperText}
                        disabled={item.disabled}
                        margin='dense'
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={InputProps}
                        />
                </Grid>
            )
        }

        return (
            <Card className={classes.card}>
                <CardHeader
                    title='登录'
                    action={
                        <IconButton onClick={handleModalClose}>
                            <CloseIcon />
                        </IconButton>
                    }
                    />
                <Divider />
                <CardContent>
                    <Grid container direction='column' spacing={8}>
                        {textField({
                            name: 'account',
                            type: 'email',
                            label: '手机号码或邮箱',
                            placeholder: '请输入手机号码或邮箱地址',
                        })}
                        {textField({
                            name: 'password',
                            type: password.showPassword ? 'text' : 'password',
                            label: '密码',
                            placeholder: '请输入密码',
                            InputProps: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                          aria-label="Toggle password visibility"
                                          onClick={this.handleToggleShowPassword}
                                        >
                                            {password.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            },
                        })}
                        {
                            captcha
                            ?
                            <Grid item>
                                <Grid container spacing={8} alignItems="center">
                                    {textField({
                                        name: 'captchaState',
                                        label: '验证码',
                                        placeholder: '请输入验证码',
                                    })}
                                    <Grid item>
                                        <img src={captcha.url} onClick={getCaptcha}></img>
                                    </Grid>
                                </Grid>
                            </Grid>
                            :
                            null
                        }
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={this.signin}
                                disabled={signInButton.disabled}
                                >
                                {signInButton.name}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardContent>
                    没有账号?
                    <Button
                        className={classes.switchButton}
                        variant="contained"
                        color="primary"
                        onClick={switchModal}
                        >
                        注册
                    </Button>
                </CardContent>
            </Card>
        )
    }
}

export default SignInCard;
