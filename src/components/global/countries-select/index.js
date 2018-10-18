import React from 'react';
import PropTypes from 'prop-types';

// Redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { getCountries } from '../../../reducers/countries';
import { loadCountries } from '../../../actions/countries';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const materialStyles = theme => ({
    textField: {
        width: '100%',
    },
    select: {
        [theme.breakpoints.down('xs')]: {
            fontSize: 12,
        }
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        }
    },
});

@connect(
    (state, props) => ({
        countries: getCountries(state)
    }),
    (dispatch) => ({
        loadCountries: bindActionCreators(loadCountries, dispatch)
    })
)
@withStyles(materialStyles)
export class CountriesSelect extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        countries: PropTypes.array,
        initialAbbr: PropTypes.string,
        onChange: PropTypes.func
    }

    static defaultProps = {
        countries: [],
        initialAbbr: 'CN',
        onChange: () => {},
    }

    constructor(props) {
        super(props);
        this.state = {
            abbr: props.initialAbbr,
        }
    }

    getCodeByAbbr = (abbr) => {
        const { countries } = this.props;
        if (countries.length === 0) return null;
        return countries.find((item) => (item.abbr === abbr)).code;
    }

    async componentDidMount() {
        const { countries, initialAbbr, loadCountries, onChange } = this.props;
        let res, err;
        if (countries.length === 0) [err, res] = await loadCountries();
        onChange(this.getCodeByAbbr(initialAbbr));
    }

    handleChange = (event) => {
        let abbr = event.target.value;
        this.setState({
            abbr,
        })
        this.props.onChange(this.getCodeByAbbr(abbr));
    }

    render() {
        const { classes, countries } = this.props;


        return (
            <TextField
                className={classes.textField}
                value={this.state.abbr}
                onChange={this.handleChange}
                margin="dense"
                variant="outlined"
                select
                SelectProps={{
                    className: classes.select
                }}
                fullWidth
                >
                {
                    countries.map((item, index) => (
                        <MenuItem key={index} value={item.abbr}>
                            <div className={classes.textContainer}>
                                <div>{`${item.name} `}</div>
                                <div>{item.code}</div>
                            </div>
                        </MenuItem>
                    ))
                }
            </TextField>
        )
    }
}

export default CountriesSelect;
