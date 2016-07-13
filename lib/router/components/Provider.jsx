const React = require('react');

module.exports = React.createClass({
  displayName: 'router/Provider',
  childContextTypes: require('../contextTypes.js'),

  getChildContext() {
    return {
      router: this.props.router
    };
  },
  render: function() {
    return React.Children.only(this.props.children);
  }
});
