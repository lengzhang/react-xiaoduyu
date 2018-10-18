import React from 'react';
import PropTypes from 'prop-types';

import Device from '../../common/device';
import CountriesSelect from '../global/countries-select';
import CaptchaButton from '../global/captcha-button';

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

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
    formControl: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    formLabel: {
        marginRight: theme.spacing.unit,
    },
});

@withStyles(materialStyles)
export class SignUpCard extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        handleModalClose: PropTypes.func.isRequired,
        switchModal: PropTypes.func.isRequired,
        signIn: PropTypes.func.isRequired,
        signUp: PropTypes.func.isRequired,
        captchaState: PropTypes.object,
        getCaptcha: PropTypes.func.isRequired,
        msgOpen: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            type: 'email',
            areaCode: '',
            nickname: {
                value: '',
                error: false,
                helperText: '',
                disabled: false,
            },
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
            confirmPassword: {
                value: '',
                error: false,
                helperText: '',
                disabled: false,
                showPassword: false,
            },
            gender: {
                value: '',
                error: false,
                disabled: false,
            },
            captcha: {
                value: '',
                error: false,
                disabled: false,
            },
            signUpButton: {
                name: '注册',
                disabled: false,
            }
        }
    }

    switchRegisterType = () => {
        this.setState({
            type: this.state.type === 'email' ? 'phone' : 'email',
        })
    }

    changeAreaCode = (code) => {
        this.setState({
            areaCode: code,
        })
    }

    handleTextChange = (name) => (event) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], {value: `${event.target.value}`}),
        })
    }

    handleKeyUp = (event) => {
        if (event.keyCode === 13) this.signup(event);
    }

    handleToggleShowPassword = (name) => (event) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], {showPassword: !this.state[name].showPassword}),
        })
    }

    handleGender = (event) => {
        this.setState({
            gender: Object.assign({}, this.state.gender, {value: event.target.value}),
        });
    }

    sendCaptcha = () => {
        const { type, areaCode, account } = this.state;
        this.checkTextField('account', (type === 'email' ? '请输入邮箱' : '请输入手机号码'));
        if (account.value === '') return null;

        let args = { type: 'sign-up' };

        if (type === 'email') {
            args.email = account.value;
        }
        else {
            args.area_code = areaCode;
            args.phone = account.value;
        }

        return {args};
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

    checkEmailFormat = (str) => {
        let regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (regExp.test(str)) {
            this.handleErrorTextField('account', false, '');
            return true;
        }
        else {
            this.handleErrorTextField('account', true, '邮箱地址格式不正确, 请重新输入');
            return false;
        }
    }

    checkPhoneFormat = (str) => {
        let regExp = /\d+$/;
        if (regExp.test(str)) {
            this.handleErrorTextField('account', false, '');
            return true;
        }
        else {
            this.handleErrorTextField('account', true, '手机号码格式不正确, 请重新输入');
            return false;
        }
    }

    signup = async (event) => {
        const { type, areaCode, nickname, account, password, confirmPassword, gender, captcha } = this.state;
        const { msgOpen } = this.props;
        this.checkTextField('nickname', '请输入名字');
        this.checkTextField('account', (type === 'email' ? '请输入邮箱' : '请输入手机号码'));
        this.checkTextField('password', '请输入密码');
        this.checkTextField('confirmPassword', '请再次输入密码');
        this.checkTextField('captcha', '请输入验证码');
        this.checkTextField('gender');

        if (
            account.value === ''
            || (account.value != '' && type === 'email' && !this.checkEmailFormat(account.value))
            || (account.value != '' && type === 'phone' && !this.checkPhoneFormat(account.value))
            || nickname.value === ''
            || password.value === ''
            || confirmPassword.value === ''
            || gender.value === ''
        ) {
            if (gender.value === '') msgOpen({msg: '请选择性别', type: 'error'});
            return;
        }

        if (password.value != confirmPassword.value) {
            this.setState({
                password: Object.assign(
                    {},
                    this.state.password,
                    {error: true, helperText: '输入的密码不一样, 请再次确认密码'}),
                confirmPassword: Object.assign(
                    {},
                    this.state.confirmPassword,
                    {error: true, helperText: '输入的密码不一样, 请再次确认密码'}),
            })
            msgOpen({msg: '输入的密码不一样, 请再次确认密码', type: 'error'});
            return;
        }

        let data = {
            nickname: nickname.value,
            password: password.value,
            gender: gender.value === 'male' ? 1 : 0,
            source: parseInt(Device.getCurrentDeviceId()),
            captcha: captcha.value,
        }

        if (type === 'email') {
            data.email = account.value;
        }
        else {
            data.area_code = areaCode;
            data.phone = account.value;
        }

        let [ err, res ] = await this.props.signUp(data);
        if (err) {
            msgOpen({msg: err.message, type: err.name});
            return;
        }
        else {
            msgOpen({msg: '注册成功, 请登录', type: 'success'});
        }

        this.props.switchModal();
    }

    render() {
        const { classes, handleModalClose, switchModal, getCaptcha } = this.props;
        const { type, areaCode, nickname, account, password, confirmPassword, gender, signInButton, signUpButton} = this.state;

        const textField = ({name, type = 'text', label, placeholder, InputProps = {}}) => {
            const item = this.state[name];
            return (
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
            )
        }

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
                            {textField({
                                name: 'nickname',
                                label: '名字',
                                placeholder: '请输入名字',
                            })}
                        </Grid>
                        <Grid item>
                            {
                                type === 'email'
                                ?
                                textField({
                                    name: 'account',
                                    type: 'email',
                                    label: '邮箱',
                                    placeholder: '请输入邮箱地址',
                                })
                                :
                                <Grid container spacing={8} direction='row' justify='flex-start' alignItems='center' wrap='nowrap'>
                                    <Grid item xs={4}><CountriesSelect onChange={this.changeAreaCode}/></Grid>
                                    <Grid item xs={8}>
                                        {textField({
                                            name: 'account',
                                            type: 'tel',
                                            label: '手机',
                                            placeholder: '请输入手机号码',
                                        })}
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                        <Grid item>
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
                                              onClick={this.handleToggleShowPassword('password')}
                                            >
                                                {password.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                },
                            })}
                        </Grid>
                        <Grid item>
                            {textField({
                                name: 'confirmPassword',
                                type: confirmPassword.showPassword ? 'text' : 'password',
                                label: '确认密码',
                                placeholder: '请再次输入密码',
                                InputProps: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                              aria-label="Toggle password visibility"
                                              onClick={this.handleToggleShowPassword('confirmPassword')}
                                            >
                                                {confirmPassword.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                },
                            })}
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <FormLabel
                                    className={classes.formLabel}
                                    error={gender.error}
                                    >性别</FormLabel>
                                <RadioGroup
                                    aria-label="Gender"
                                    value={gender.value}
                                    onChange={this.handleGender}
                                    row
                                    >
                                    <FormControlLabel value='male' control={<Radio />} label='男' />
                                    <FormControlLabel value='female' control={<Radio />} label='女' />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item container spacing={16} justify='center' alignItems='center' alignContent='center'>
                            <Grid item xs={8}>
                                {textField({
                                    name: 'captcha',
                                    type: 'text',
                                    label: '验证码',
                                    placeholder: '请输入验证码',
                                })}
                            </Grid>
                            <Grid item xs={4}>
                                <CaptchaButton sendCaptcha={this.sendCaptcha}/>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={this.signup}
                                disabled={signUpButton.disabled}
                                >
                                {signUpButton.name}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardContent>
                    <Grid container spacing={8} direction='column'>
                        <Grid item>
                            <Button
                                variant="outlined"
                                onClick={this.switchRegisterType}
                                >
                                {type === 'email' ? '使用手机注册' : '使用邮箱注册'}
                            </Button>
                        </Grid>
                        <Grid item>
                            已经有账号了?
                            <Button
                                className={classes.switchButton}
                                variant="contained"
                                color="primary"
                                onClick={switchModal}
                                >
                                登录
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export default SignUpCard;
