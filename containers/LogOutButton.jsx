const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  return {};
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onClick: function () {
      dispatch( require('../actions/session.js').logOut() );
    }
  };
}

const LogOutButton = React.createClass({
  render: function() {
    return (
      <button onClick={this.props.onClick}>Log Out !</button>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogOutButton);