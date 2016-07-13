const React = require('react');
const PropTypes = React.PropTypes;

require('../../styles/lobby/Lobby.scss');

module.exports = React.createClass({
  displayName: 'lobby/Lobby',

  propTypes: {
    onSendMessage: PropTypes.func.isRequired,
    lobby: PropTypes.string.isRequired, // UUID
    me: PropTypes.string.isRequired, // UUID
    players: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    })).isRequired
  },

  getInitialState: function () {
    return {
      prompt: ''
    };
  },

  onInput: function (event) {
    this.setState({
      prompt: event.target.value
    });
  },

  onKeyDown: function (event) {
    if (!event.ctrlKey && !event.shiftKey  && (event.keyCode === 13)) {
      event.preventDefault();
      this.props.onSendMessage(this.state.prompt);
      this.setState({
        prompt: ''
      });
    }
  },

  render: function() {
    var players;

    players = this.props.players.map(function (player) {
      var className = (this.props.me === player.uuid) ? "lobby-Lobby__player--me" : "lobby-Lobby__player";

      return (<li className={className} key={player.uuid}>{player.label}</li>);
    }, this);

    if (players.length === 0) {
      players = <span>Nobody !</span>
    } else {
      players = (<ul>{players}</ul>);
    }

    var messages;

    messages = this.props.messages.map(function (message) {
      var className = (this.props.me === message.author) ? "lobby-Lobby__message--me" : "lobby-Lobby__message";

      return (
        <li className={className} key={message.uuid}>
          <span className="lobby-Lobby__message-author">{message.author}</span> : <span className="lobby-Lobby__message-content">{message.content}</span>
        </li>
      );
    }, this);

    return (
      <div className="lobby-Lobby">
        <div className="lobby-Lobby__main">
          <div className="lobby-Lobby__messages">
            <ul>{messages}</ul>
          </div>
          <div className="lobby-Lobby__players">
            {players}
          </div>
        </div>
        <div className="lobby-Lobby__prompt">
          <textarea value={this.state.prompt} type="text" onInput={this.onInput} onKeyDown={this.onKeyDown} />
        </div>
      </div>
    );
  }
});
