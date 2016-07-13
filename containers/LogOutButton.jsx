const React = require('react');
const ReactRedux = require('react-redux');

const CreateLobbyButton = require('./CreateLobbyButton.jsx');

var Link = require('../lib/router/components/Link.jsx');

function mapStateToProps (state, ownProps) {
  var displayName;

  try {
    displayName = state.session.account.displayName
  } catch (error) {
  }

  return {
    displayName: displayName,
    lobbyUUID: state.lobby.uuid || null
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onClick: function () {
      dispatch( require('../actions/session.js').logOut() );
    }
  };
}

const LogOutButton = React.createClass({
  propTypes: {
    displayName: React.PropTypes.string,
    lobbyUUID: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },
  render: function() {
    var content;

    var lobby;

    if (this.props.lobbyUUID) {
      lobby = <div><Link path={ '/lobby/' + this.props.lobbyUUID + '.html' }>Go To Lobby [{this.props.lobbyUUID}]</Link></div>
    } else {
      lobby = <div><CreateLobbyButton /></div>
    }

    if (this.props.displayName) {
      return (
        <div>
          <div>
            <a href="/account/@me.html">{this.props.displayName}</a>
            <button onClick={this.props.onClick}>Log Out !</button>
          </div>
          {lobby}
        </div>
      );
    }

    return (
      <div><Link path="/authorize.html">Connect !</Link></div>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogOutButton);