const React = require('react');
const ReactRedux = require('react-redux');

const CreateLobbyButton = require('../CreateLobbyButton.jsx');
const Link = require('../../lib/router/components/Link.jsx');

function mapStateToProps (state, ownProps) {
  var lobbies = [];

  try {
    state.session.account.lobbies.map(function (uuid) {
      if (state.collections.lobby[uuid]) {
        lobbies.push(state.collections.lobby[uuid]);
      }
    });
  } catch (error) {
  }

  return {
    lobbies: lobbies
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {};
}

const Lobbies = React.createClass({
  displayName: 'lobby/Lobbies',
  propTypes: {
    lobbies: React.PropTypes.array.isRequired
  },
  render: function() {
    var content;

    var lobbies = this.props.lobbies.map(function (lobby) {
      return <li key={lobby.uuid}><Link path={ '/lobby/' + lobby.uuid + '.html' }>Lobby@{lobby.uuid}</Link></li>
    });

    return (
      <div>
        <div>Lobbies</div>
        <ul>
          {lobbies}
        </ul>
        <div><CreateLobbyButton /></div>
      </div>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobbies);