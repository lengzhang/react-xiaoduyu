import merge from 'lodash/merge'


let initialState = {
    open: false,
    message: '',
    vertical: 'bottom',
    horizontal: 'center',
    autoHideDuration: 6000,
    variant: 'success',
}

export default function mssageBar(state = initialState, action = {}) {
    switch (action.type) {

        case 'MESSAGE_BAR_OPEN':
            var { message, vertical, horizontal, autoHideDuration, variant } = action;
            state = {
                open: true,
                message,
                vertical,
                horizontal,
                autoHideDuration,
                variant
            }
            return merge({}, state, {})

        case 'MESSAGE_BAR_CLOSE':
            state = {
                open: false,
            }
            return merge({}, state, {})

        default:
            return state;
    }
}

/*

open: PropTypes.bool.isRequired,
message: PropTypes.string.isRequired,
onClose: PropTypes.func.isRequired,
vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
horizontal: PropTypes.oneOf(['left', 'center', 'right']),
autoHideDuration: PropTypes.number,
variant: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
*/

export const getCaptchaById = (state, id) => {
    return state.mssageBar[id] ? state.mssageBar[id] : null
}
