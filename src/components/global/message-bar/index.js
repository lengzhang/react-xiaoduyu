import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const materialStyles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

@withStyles(materialStyles)
export class MessageBar extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
        vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
        horizontal: PropTypes.oneOf(['left', 'center', 'right']),
        autoHideDuration: PropTypes.number,
        variant: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
    }

    static defaultProps = {
        vertical: 'bottom',
        horizontal: 'center',
        autoHideDuration: 6000,
        variant: 'success',
    }

    render() {
        const { classes, open, message, onClose, vertical, horizontal, autoHideDuration, variant } = this.props;
        const Icon = variantIcon[variant];

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: vertical,
                    horizontal: horizontal
                }}
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={onClose}
                >
                <SnackbarContent
                    className={classes[variant]}
                    message={
                        <span className={classes.message}>
                            <Icon className={classNames(classes.icon, classes.iconVariant)} />
                            {message}
                        </span>
                    }
                    action={
                        <IconButton
                            key='close'
                            aria-label='Close'
                            color='inherit'
                            onClick={onClose}
                            >
                            <CloseIcon className={classes.icon} />
                        </IconButton>
                    }
                    />
            </Snackbar>
        )
    }
}

export default MessageBar;
