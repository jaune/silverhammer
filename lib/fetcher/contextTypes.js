const React = require('react');

module.exports = {
  'fetcher': React.PropTypes.shape({
    fetch: React.PropTypes.func.isRequired,
    isClientSide: React.PropTypes.bool.isRequired
  }).isRequired
};