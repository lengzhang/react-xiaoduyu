import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import classNames from 'classnames';

// material-ui
import {withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import TopIcon from '@material-ui/icons/KeyboardArrowUp';

const materialStyles = theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing.unit*5,
        right: theme.spacing.unit*3,
        [theme.breakpoints.down('xs')]: {
            bottom: theme.spacing.unit*2,
            right: theme.spacing.unit*2,
        }
    }
});

@withStyles(materialStyles)
export class ScrollTopButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollTop: 0,
        }
    }

    componentDidMount() {
        // window.addEventListener('scroll', this.scroll.bind(this));
        ScrollListener.add('scroll-top-button', this.scroll);
    }

    componentWillUnmount() {
        // window.removeEventListener('scroll');
        ScrollListener.remove('scroll-top-button');
    }

    scroll = () => {
        this.setState({
            scrollTop: window.pageYOffset
        })
    }

    onClick = () => {
        if (this.state.scrollTop > 0) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { scrollTop } = this.state;

        return (
            <div className={classes.root}>
                <Fade in={scrollTop > 500}>
                    <Button variant="fab" mini onClick={this.onClick}>
                        <TopIcon />
                    </Button>
                </Fade>
            </div>
        )
    }
}

export default ScrollTopButton;
