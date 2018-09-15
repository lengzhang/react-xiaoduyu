import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CSSModules from 'react-css-modules';
import styles from './style.scss';


export class Head extends React.Component {

  static propTypes = {

  }

  constructor(props) {
    super(props);
  }

  render() {

    const { userinfo } = this.props

    return (<header>
        Header
    </header>)

  }

}

Head = CSSModules(Head, styles);

const mapStateToProps = (state, props) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

Head = connect(mapStateToProps,mapDispatchToProps)(Head);

export default Head;
