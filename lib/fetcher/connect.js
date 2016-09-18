const React = require('react');

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

module.exports = function (options) {

  return function (WrappedComponent) {

    return React.createClass({
      displayName: 'Fetcher(' + getDisplayName(WrappedComponent) + ')',
      contextTypes: require('./contextTypes.js'),

      componentDidMount: function () {
        if (this.context.fetcher.isClientSide) {
          this.context.fetcher.fetch(options);
        }
      },

      render: function () {
        if (!this.context.fetcher.isClientSide) {
          this.context.fetcher.fetch(options);
        }
        return React.createElement(WrappedComponent, this.props);
      }
    });

  }

};