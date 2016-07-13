const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  return {
    lobby: 'qsdqsd-qsdqsd-qsdq-sdqsd',
    me: 'kjqms-kdjml-qkjsd-mlkqd-sdjdm',
    messages: [],
    players: []
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSendMessage: function (message) {
      dispatch({
        type: 'lobby/SEND_MESSAGE',
        payload: {
          message: message
        }
      });
    }
  };
}

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(require('../../components/lobby/Lobby.jsx'));