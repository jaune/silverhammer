const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  return {};
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onCreateLobbyClick: function () {
      dispatch( require('../actions/lobby.js').createLobby() );
    }
  };
}

const CreateLobbyButton = React.createClass({
  propTypes: {
    onCreateLobbyClick: React.PropTypes.func.isRequired
  },
  render: function() {
    var content;

    return (
      <div>
        <button onClick={this.props.onCreateLobbyClick}>Create a lobby !</button>
      </div>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CreateLobbyButton);