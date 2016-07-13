const React = require('react');
const ReactRedux = require('react-redux');

var Link = React.createClass({
  displayName: 'router/Link',
  contextTypes: require('../contextTypes.js'),

  getInitialState: function () {
    const route = this.context.router.resolve(this.props.path);

    if (!route) {
      console.log('Warning: Missing route for path `' + this.props.path + '`');
    }

    return {
      route: route
    }
  },
  onClick: function (event) {
    if ((event.button === 0) && !event.ctrlKey) {
      event.preventDefault();
      this.props.dispatch({
        type: 'router/PUSH_HISTORY_STATE',
        payload: this.state.route
      });
    }
  },
  render: function() {
    const route = this.state.route;

    if (!route.virtual) {
      return (<a href={route.url}>{this.props.children}</a>);
    }
    return (<a href={route.url} onClick={this.onClick}>{this.props.children}</a>);
  }
});

module.exports = ReactRedux.connect(function () { return {}; }, function (dispatch) { return { dispatch: dispatch }; } )(Link);