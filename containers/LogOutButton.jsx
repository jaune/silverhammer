const React = require('react');
const ReactRedux = require('react-redux');

const Lobbies = require('../lobby/Lobbies.jsx');
const Link = require('../lib/router/components/Link.jsx');


function mapStateToProps (state, ownProps) {
  var displayName;

  try {
    displayName = state.session.account.displayName
  } catch (error) {
  }

  return {
    displayName: displayName
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
    onClick: React.PropTypes.func.isRequired
  },
  render: function() {
    var content;

    if (this.props.displayName) {
      return (
        <div>
          <div>
            <a href="/account/@me.html">{this.props.displayName}</a>
            <button onClick={this.props.onClick}>Log Out !</button>
          </div>
          <Lobbies />
        </div>
      );
    }

    return (
      <div><Link path="/authorize.html">Connect !</Link></div>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogOutButton);