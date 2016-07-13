const React = require('react');
const ReactRedux = require('react-redux');

module.exports = React.createClass({
  displayName: 'block/MainContent',

  render: function() {
    var content;

    switch (this.props.route) {
      case '/lobby/:lobby_uuid.html':
        content = require('../containers/lobby/Lobby.jsx');
        break;
      case '/authorize.html':
        content = require('../containers/Passports.jsx');
        break;
      default:
        content = (<div>Default</div>);
    }

    return React.Children.only(content);
  }
});

function mapStateToProps (state, ownProps) {
  return {
    route: state.router.pattern
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {};
}

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(module.exports);