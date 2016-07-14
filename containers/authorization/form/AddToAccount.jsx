const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  var uuid = state.router.params.authorization_uuid;

  return {
    authorization: state.collections.authorization[uuid]
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {};
}

const CreateLobbyButton = React.createClass({
  displayName: 'authorization/form/AddToAccount',
  propTypes: {},
  render: function() {
    var content;

    return (
      <form method="POST" action="/account/@me/authorization/">
        <input type="hidden" name="authorization_uuid" value={this.props.authorization.uuid}></input>
        <button type="submit">Add to an Account !</button>
      </form>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CreateLobbyButton);