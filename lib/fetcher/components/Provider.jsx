const React = require('react');

module.exports = React.createClass({
  displayName: 'fetcher/Provider',
  childContextTypes: require('../contextTypes.js'),

  getChildContext() {
    return {
      fetcher: this.props.fetcher
    };
  },
  render: function() {
    return React.Children.only(this.props.children);
  }
});
