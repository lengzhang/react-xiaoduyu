import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import parseUrl from '../common/parse-url';

// 壳组件，用于给页面组件，套一个外壳
// 这样可以通过壳组件，给每个页面，传递参数


// material-ui
import {withStyles} from '@material-ui/core/styles';

const materialStyles = theme => ({
    root: {
        paddingTop: theme.spacing.unit*11,
        paddingBottom: theme.spacing.unit*11,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        [theme.breakpoints.down('xs')]: {
            paddingTop: theme.spacing.unit*17,
            paddingBottom: theme.spacing.unit*17,
        }
    }
});

const Shell = (Component) => {

    if (!Component.loadData) {
        Component.loadData = ({store, match}) => {
            return new Promise(async function(resolve, reject) {
                resolve({code: 200});
            })
        }
    }

    class Shell extends React.Component {

        static defaultProps = {
            loadData: Component.loadData || null
        }

        constructor(props) {
            super(props);
            this.state = {
                notFoundPage: ''
            }
        }

        // 组件加载完成
        componentWillMount() {
            const {search} = this.props.location;
            this.props.location.params = search
                ? parseUrl(search)
                : null;
            // console.log('进入组件')
            if (this.props.staticContext) {
                const {code, text} = this.props.staticContext;
                if (code == 404) {
                    this.state.notFoundPgae = text || '404 NOT FOUND'
                }
            }
        }

        // 组件加载完成
        componentDidMount() {
            // console.log('组件加载完成');
        }

        // 更新组件
        componentDidUpdate() {
            // console.log('组件加载更新了');
        }

        // 组件被卸载
        componentWillUnmount() {
            // console.log('组件加载被卸载');
        }

        render() {
            const self = this;
            const {notFoundPage} = this.state;

            return (<div className={this.props.classes.root}>
                {
                    notFoundPage
                        ?
                        <div>{notFoundPage}</div>
                        :
                        <Component
                            {...this.props}
                            notFoundPage={
                                (content) => {
                                    self.setState({
                                        notFoundPage: content || '404 NOT FOUND'
                                    });
                                }
                            }/>
                }
            </div>)
        }
    }

    Shell.contextTypes = {}

    Shell.propTypes = {}

    const mapStateToProps = (state) => {
        return {}
    }

    const mapDispatchToProps = (dispatch, props) => {
        return {}
    }

    return withStyles(materialStyles)(connect(mapStateToProps, mapDispatchToProps)(Shell));
}

export default Shell;
